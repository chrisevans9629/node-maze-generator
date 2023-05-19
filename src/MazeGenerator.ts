import { DirectionName, DoorCount, GetDirection, IDirectionTransform, IsBlocked, IsValidDoor } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IRoom, IRoomTemplate } from "./Interfaces/IRoom";
import { ISelector } from "./Selector";

export class MazeGenerator {
    private selector: ISelector;
    private matrix: string[][];
    explored: IRoom[];
    rooms: IRoomTemplate[];
    constructor(selector: ISelector, rooms: IRoomTemplate[]) {
        this.selector = selector;
        this.matrix = [
            ["1111"], //all doors
            ["0111", "1011", "1101", "1110"], //three way
            ["1100","1001","0011","0110"], //corners
            ["1010","0101"], //hallway
            ["1000", "0100", "0010", "0001"] //closed room
        ];

        this.explored = [];
        this.rooms = rooms;
    }

    RemoveRoom(id: string){
        let room = this.rooms.filter(r => r.title === id)[0];

        if(room && room.isFinite){
            room.count--;
            if(room.count <= 0){
                let ri = this.rooms.indexOf(room);
                if(ri > -1){
                    this.rooms.splice(ri, 1);
                }
            }
        }
    }

    GetRoom(dir: IDirection, action: IDirectionTransform | null): IRoomTemplate | null {
        
        this.selector.Create(dir);

        let rooms = this.rooms.filter(r => r.levels[dir.z] === "1");
        if(action && action.name === DirectionName.Up) {
            rooms = this.rooms.filter(r => r.door[5] === "1");
        } else if(action && action.name === DirectionName.Down) {
            rooms = this.rooms.filter(r => r.door[4] === "1");
        }

        let room = this.selector.GetItem(rooms);
        if(!room)
        {
            return null;
        }
        let door = room.door;

        this.matrix.forEach(m => {
            if(m.includes(door)){
                //door = m[Math.floor(rng()*m.length)];
                door = this.selector.GetItem(m);
            }
        });   
        return { door: door, title: room.title, isFinite: room.isFinite, count: room.count, color: room.color, levels: room.levels };
    }

    GetExplored(prevDir: IDirection) {
        let search = this.explored.filter(door => door.x == prevDir.x && door.y == prevDir.y && prevDir.z == door.z);
        if (search.length > 0) {
            return search[0];
        }
        return null;
    }
    Rotate(doorIndex: number, door1: string): string[] {

        let upDown = "";
        if(door1.length > 4){
            upDown = door1[4] + door1[5];
            door1 = door1.substring(0,4);
        }
        //remove the up/down doors since they can't be rotated... that wouldn't make sense.
        let doorCount = DoorCount(door1);

        let matchingDoors: string[] = [];

        for (let index = 0; index < this.matrix.length; index++) {
            const m = this.matrix[index];
            if(m.includes(door1)){
                matchingDoors = m.filter(door => IsValidDoor(doorIndex, doorCount, door));
                //console.log(doorIndex,door1, "part of", m, " matches ", matchingDoors);
            }
        }

        //add the up/down doors back.
        return matchingDoors.map(m => m + upDown);
    }

    Start(rooms:IRoom[]){
        rooms.forEach(r => {
            this.explored.push(r);
        })
    }

    CreateRoom(newDir: IDirection, prevDir: IDirection): IRoom {
        if(newDir.x === prevDir.x && newDir.y === prevDir.y && newDir.z === prevDir.z){
            throw "new direction cannot match previous";
        }

        let lastCalc = this.GetExplored(newDir);
        let pRoom = this.GetExplored(prevDir);

        if (lastCalc) {
            if(pRoom){
                let blocked = this.CheckBlocked(pRoom, newDir, lastCalc.door);
                if(blocked !== null){
                    throw "invalid move";
                }
            }
            return lastCalc;
        }
        let trans = GetDirection(prevDir, newDir);

        let room = this.GetRoom(newDir, trans);
        if(!room){
            throw "no more rooms!";
        }
        let door = room.door;

        if (pRoom) {

            let blocked = this.CheckBlocked(pRoom, newDir, door);

            if (blocked !== null && blocked >= 0) {
                this.selector.Create(newDir);
                door = this.selector.GetItem(this.Rotate(blocked, door));
            }
        }

        let roomFinal: IRoom = { x: newDir.x, y: newDir.y, z: newDir.z, door: door, title: room.title, color: room.color, levels: room.levels };
        this.explored.push(roomFinal);
        this.RemoveRoom(room.title);
        return roomFinal;
    }

    private CheckBlocked(pRoom: IRoom, newDir: IDirection, door: string) {
        let blocked = IsBlocked(pRoom, { x: newDir.x, y: newDir.y, z: newDir.z, door: door });

        if (blocked === -1) {
            throw "invalid move";
        }
        return blocked;
    }
}

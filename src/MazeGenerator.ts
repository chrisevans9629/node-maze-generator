import { DoorCount, IsBlocked, IsValidDoor, mulberry32 } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IRoom, IRoomTemplate } from "./Interfaces/IRoom";


export class MazeGenerator {
    private seed: number;
    private matrix: string[][];
    explored: IRoom[];
    rooms: IRoomTemplate[];
    constructor(seed: number, rooms: IRoomTemplate[]) {
        this.seed = seed;
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

    RemoveRoom(name: string){
        let room = this.rooms.filter(r => r.title === name)[0];

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

    CreateRandom(dir: IDirection){
        return mulberry32(dir.x * 7 + dir.y * 77 + dir.z * 777 + this.seed);
    }

    GetRandom<Type>(rng:()=>number,data:Type[]): Type {
        let ii = Math.floor(rng() * data.length);
        return data[ii];
    }

    GetRoom(dir: IDirection): IRoomTemplate {
        if (dir.x == 0 && dir.y == 0 && dir.z == 0) {
            return { door: "1111", title: "Entrance Hall", isFinite:true, count:1, color: "white" };
        }
        let rng = this.CreateRandom(dir);

        let room = this.GetRandom(rng, this.rooms);
        if(!room)
        {
            return null;
        }
        let door = room.door;

        this.matrix.forEach(m => {
            if(m.includes(door)){
                door = m[Math.floor(rng()*m.length)];
            }
        });   
        return { door: door, title: room.title, isFinite: room.isFinite, count: room.count, color: room.color };
    }

    GetExplored(prevDir: IDirection) {
        let search = this.explored.filter(door => door.x == prevDir.x && door.y == prevDir.y && prevDir.z == door.z);
        if (search.length > 0) {
            return search[0];
        }
        return null;
    }
    rotate(doorIndex: number, door1: string): string[] {

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
    CreateRoom(newDir: IDirection, prevDir: IDirection): IRoom {

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

        let room = this.GetRoom(newDir);
        if(!room){
            throw "no more rooms!";
        }
        let door = room.door;

        if (pRoom) {

            let blocked = this.CheckBlocked(pRoom, newDir, door);

            if (blocked !== null && blocked >= 0) {
                let rng = this.CreateRandom(newDir);
                door = this.GetRandom(rng, this.rotate(blocked, door));
            }
        }

        let roomFinal = { x: newDir.x, y: newDir.y, z: newDir.z, door: door, title: room.title, color: room.color };
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

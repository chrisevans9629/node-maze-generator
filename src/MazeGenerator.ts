import { DoorCount, IsBlocked, IsValidDoor, mulberry32 } from "./Helpers";
import { IRoom, IRoomTemplate } from "./Interfaces/IRoom";


export class MazeGenerator {
    seed: number;
    matrix: string[][];
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

    CreateRandom(x:number, y:number){
        return mulberry32(x * 7 + y * 77 + this.seed);
    }

    GetRandom<Type>(rng:()=>number,data:Type[]): Type {
        let ii = Math.floor(rng() * data.length);
        return data[ii];
    }

    GetRoom(x: number, y: number): IRoomTemplate {
        if (x == 0 && y == 0) {
            return { door: "1111", title: "Entrance Hall", isFinite:true, count:1, color: "white" };
        }
        let rng = this.CreateRandom(x,y);

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

    GetPrevious(x: number, y: number) {
        let search = this.explored.filter(door => door.x == x && door.y == y);
        if (search.length > 0) {
            return search[0];
        }
        return null;
    }
    rotate(doorIndex: number, door1: string): string[] {
        let doorCount = DoorCount(door1);

        let matchingDoors = [];

        for (let index = 0; index < this.matrix.length; index++) {
            const m = this.matrix[index];
            if(m.includes(door1)){
                matchingDoors = m.filter(door => IsValidDoor(doorIndex, doorCount, door));
                //console.log(doorIndex,door1, "part of", m, " matches ", matchingDoors);
            }
        }

        return matchingDoors;
    }
    CreateRoom(x: number, y: number, px: number, py: number): IRoom {

        let lastCalc = this.GetPrevious(x, y);
        if (lastCalc) {
            //console.log("skipped");
            return lastCalc;
        }

        let room = this.GetRoom(x, y);
        if(!room){
            throw "no more rooms!";
        }
        let door = room.door;
        //console.log("new", room);

        let pRoom = this.GetPrevious(px, py);
        if (pRoom) {

            //console.log("prev", pRoom);

            let blocked = IsBlocked(pRoom, { x: x, y: y, door: door });
            //console.log('rotating...', blocked);

            if (blocked === -1) {
                throw "invalid move";
            }

            if (blocked !== null && blocked >= 0) {
                let rng = this.CreateRandom(x,y);
                door = this.GetRandom(rng, this.rotate(blocked, door));
                //console.log("rotated", room);
            }

        }

        let roomFinal = { x: x, y: y, door: door, title: room.title, color: room.color };
        this.explored.push(roomFinal);
        this.RemoveRoom(room.title);
        return roomFinal;
    }
}

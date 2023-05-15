import { IDirection } from "./Interfaces/IDirection";
import { IDoor } from "./Interfaces/IDoor";


let left = [-1, 0, 0];
let right = [1, 0, 0];
let foreward = [0, -1, 0];
let backward = [0, 1, 0];
let up = [0,0,1];
let down = [0,0,-1];


let leftDoor = [2, 0];
let rightDoor = [0, 2];
let foreDoor = [3, 1];
let backDoor = [1, 3];

let upDoor = [5, 4];
let downDoor = [4, 5];

let leftCheck = { delta: left, comp: leftDoor, name: "left" };
let rightCheck = { delta: right, comp: rightDoor, name: "right" };
let foreCheck = { delta: foreward, comp: foreDoor, name: "foreward" };
let backCheck = { delta: backward, comp: backDoor, name: "backward" };
let upCheck = {delta: up, comp: upDoor, name: "up"};
let downCheck = {delta: down, comp: downDoor, name: "down"};

export let dirChecks = [leftCheck, rightCheck, foreCheck, backCheck, upCheck, downCheck];


export function mulberry32(a: number) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function DoorCount(door: string) {
    // Count the number of 1's in the door
    let numOnes = 0;
    for (let i = 0; i < door.length; i++) {
        if (door.charAt(i) === "1") {
            numOnes++;
        }
    }
    return numOnes;
}

export function IsValidDoor(doorIndex: number, doorCount: number, door: string) {
    return door.charAt(doorIndex) === "1" && doorCount == DoorCount(door);
}

export function GetDirection(prev: IDirection, door: IDirection) {
    for (let i = 0; i < dirChecks.length; i++) {
        let dir = dirChecks[i];

        if (door && prev 
            && door.x - prev.x == dir.delta[0] 
            && door.y - prev.y == dir.delta[1]
            && door.z - prev.z == dir.delta[2]) {
            return dir;
        }
    }

    return null;
}
//This method loops through the 4 directions and determines which direction we are checking.
//Then, we check the doors that match that direction.
//If the doors do not match, then it's blocked, so we need to rotate the room.
export function IsBlocked(prev: IDoor, door: IDoor) {
    let dir = GetDirection(prev, door);

    if (!dir) {
        return null;
    }

    let di = dir.comp[0];
    let pdi = dir.comp[1];

    if (prev.door[pdi] === undefined || prev.door[pdi] === "0") {
        return -1;
    }

    if (door && door.door[di] === "0") {
        return di;
    }

    return null;
}
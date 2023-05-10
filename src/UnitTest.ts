import { DoorCount, GetDirection, IsBlocked, IsValidDoor } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";

function Test(expected: any, actual: any) {
    if (expected !== actual) {
        throw expected + "!==" + actual;
    }
}

export function RunTests() {
    //Unit Tests
console.log("Unit Tests")
Test("right", GetDirection({ x: 0, y: 0 }, { x: 1, y: 0 }).name)
Test("left", GetDirection({ x: 0, y: 0 }, { x: -1, y: 0 }).name)
Test("up", GetDirection({ x: 0, y: 0 }, { x: 0, y: -1 }).name)
Test("down", GetDirection({ x: 0, y: 0 }, { x: 0, y: 1 }).name)
Test(null, GetDirection({ x: 0, y: 0 }, { x: 1, y: 1 }))
Test(null, GetDirection(null, { x: 0, y: 0 }))
Test(null, GetDirection({ x: 0, y: 0 }, null))
Test(null, GetDirection(null, null))

Test(null, IsBlocked({ x: 0, y: 0, door: "1111" }, { x: 1, y: 0, door: "1111" }))
Test(0, IsBlocked({ x: 0, y: 0, door: "1111" }, { x: 1, y: 0, door: "0111" }))
Test(-1, IsBlocked({ x: 0, y: 0, door: "1101" }, { x: 1, y: 0, door: "1111" }))
Test(null, IsBlocked(null, { x: 1, y: 0, door: "1111" }))
Test(null, IsBlocked({ x: 0, y: 0, door: "1111" }, null))


let maze = new MazeGenerator(1,[]);

Test(1, DoorCount("1000"));
Test(2, DoorCount("1010"));

Test(true, IsValidDoor(0, 1, "1000"));
Test(false, IsValidDoor(1, 1, "1000"));
Test(false, IsValidDoor(0, 2, "1000"));

Test("1010", maze.rotate(2, "1010")[0]);
Test("1010", maze.rotate(2, "0101")[0]);
Test("0101", maze.rotate(1, "0101")[0]);
Test("0101", maze.rotate(1, "1010")[0]);

}


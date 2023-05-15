import { DoorCount, GetDirection, IsBlocked, IsValidDoor } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { MazeGenerator } from "./MazeGenerator";
import { rm } from "./Rooms";

function Test<T>(expected: T, actual: T) {
    if (expected !== actual) {
        console.log(`expected '${expected}' but returned '${actual}'`);
    }
}
let zero = { x: 0, y: 0, z: 0 };

export function RunTests() {
    //Unit Tests
    console.log("Unit Tests")


    Test("right", GetDirection(zero, { x: 1, y: 0, z: 0 }).name)
    Test("left", GetDirection(zero, { x: -1, y: 0, z: 0 }).name)
    Test("foreward", GetDirection(zero, { x: 0, y: -1, z: 0 }).name)
    Test("backward", GetDirection(zero, { x: 0, y: 1, z: 0 }).name)
    Test("up", GetDirection(zero, { x: 0, y: 0, z: 1 }).name)
    Test("down", GetDirection(zero, { x: 0, y: 0, z: -1 }).name);
    Test(null, GetDirection(zero, zero));
    Test(null, GetDirection(zero, { x: 1, y: 1, z: 0 }))
    Test(null, GetDirection(null, zero))
    Test(null, GetDirection(zero, null))
    Test(null, GetDirection(null, null))

    Test(null, IsBlocked({ x: 0, y: 0, z: 0, door: "1111" }, { x: 1, z: 0, y: 0, door: "1111" }))
    Test(0, IsBlocked({ x: 0, y: 0, z: 0, door: "1111" }, { x: 1, y: 0, z: 0, door: "0111" }))
    Test(-1, IsBlocked({ x: 0, y: 0, z: 0, door: "1101" }, { x: 1, y: 0, z: 0, door: "1111" }))
    Test(null, IsBlocked(null, { x: 1, z: 0, y: 0, door: "1111" }))
    Test(null, IsBlocked({ x: 0, y: 0, z: 0, door: "1111" }, null))

    Test(-1, IsBlocked({x: 0, y:0, z:0, door: "1111"}, {x:0, y:0, z:1, door: "1111"}));
    Test(null, IsBlocked({x: 0, y:0, z:0, door: "111111"}, {x:0, y:0, z:1, door: "111111"}));
    Test(null, IsBlocked({x: 0, y:0, z:0, door: "111111"}, {x:0, y:0, z:-1, door: "111111"}));
    Test(-1, IsBlocked({x: 0, y:0, z:0, door: "111101"}, {x:0, y:0, z:1, door: "111101"}));
    Test(-1, IsBlocked({x: 0, y:0, z:0, door: "111110"}, {x:0, y:0, z:-1, door: "111110"}));
    Test(5, IsBlocked({x: 0, y:0, z:0, door: "111110"}, {x:0, y:0, z:1, door: "111100"}));
    Test(4, IsBlocked({x: 0, y:0, z:0, door: "111101"}, {x:0, y:0, z:-1, door: "111100"}));


    Test(1, DoorCount("1000"));
    Test(2, DoorCount("1010"));

    Test(true, IsValidDoor(0, 1, "1000"));
    Test(false, IsValidDoor(1, 1, "1000"));
    Test(false, IsValidDoor(0, 2, "1000"));

    MazeZTest();

    MazeZRotationTest();


}

function MazeZRotationTest() {
    let maze = new MazeGenerator(1, [rm("stairwell", "111110", false), rm("upper landing", "111101", false)]);

    Test("1111", maze.CreateRoom(zero, zero).door);
    Test("111110", maze.CreateRoom({x: 1, y:0, z:0}, zero).door);
    Test("111101", maze.CreateRoom({x:1, y:0, z:1}, {x:1, y:0, z:0}).door);
}


function MazeZTest() {
    let maze = new MazeGenerator(1, [rm("stairwell", "011011", false)]);

    Test("1010", maze.rotate(2, "1010")[0]);
    Test("1010", maze.rotate(2, "0101")[0]);
    Test("0101", maze.rotate(1, "0101")[0]);
    Test("0101", maze.rotate(1, "1010")[0]);

    Test("0011", maze.rotate(2, "1100")[0]);
    Test("001111", maze.rotate(2, "110011")[0]);

    Test("1111", maze.CreateRoom(zero, zero).door);

    let pos = { x: 0, y: 1, z: 0 };
    Test("011011", maze.CreateRoom(pos, zero).door);

    let pos1 = { x: 0, y: 1, z: 1 };
    Test("011011", maze.CreateRoom(pos1, pos).door);

    //rotation test
    let pos2 = { x: 1, y: 1, z: 1 };
    Test("110011", maze.CreateRoom(pos2, pos1).door);
}




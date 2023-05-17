import { DirectionName, DoorCount, GetDirection, IsBlocked, IsValidDoor } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IRoom } from "./Interfaces/IRoom";
import { MazeGenerator } from "./MazeGenerator";
import { rm } from "./Rooms";
import { MockSelector } from "./Selector";

function Test<T>(expected: T, actual: T, becauseOf?: string) {
    if (expected !== actual) {
        console.log(`expected '${expected}' but returned '${actual}' because of ${becauseOf}`);
    }
}
let zero = { x: 0, y: 0, z: 0 };
let selector = new MockSelector();
export function RunTests() {
    //Unit Tests
    console.log("Unit Tests")


    Test(DirectionName.Right, GetDirection(zero, { x: 1, y: 0, z: 0 }).name)
    Test(DirectionName.Left, GetDirection(zero, { x: -1, y: 0, z: 0 }).name)
    Test(DirectionName.Foreward, GetDirection(zero, { x: 0, y: -1, z: 0 }).name)
    Test(DirectionName.Backward, GetDirection(zero, { x: 0, y: 1, z: 0 }).name)
    Test(DirectionName.Up, GetDirection(zero, { x: 0, y: 0, z: 1 }).name)
    Test(DirectionName.Down, GetDirection(zero, { x: 0, y: 0, z: -1 }).name);
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

    Test(5, IsBlocked({x:0, y:0, z:0, door: "111110"}, {x:0, y:0, z:1, door: "1111"}), "traveling from stairs to main would require a rotation");
    Test(-1, IsBlocked({x:0, y:0, z:0, door: "1111"}, {x:0, y:0, z:1, door: "111111"}), "main to stairs should fail");


    

    Test(1, DoorCount("1000"));
    Test(2, DoorCount("1010"));

    Test(true, IsValidDoor(0, 1, "1000"));
    Test(false, IsValidDoor(1, 1, "1000"));
    Test(false, IsValidDoor(0, 2, "1000"));

    MazeZTest();

    MazeZRotationTest();

    MazeUpDownTest();
    MazeUpDownTest1();
    console.log("Tests done");
}

function MazeZRotationTest() {
    let maze = new MazeGenerator(selector, [rm("stairwell", "111110", "1111", false), rm("upper landing", "111101", "1111", false)]);

    maze.Start([{x:0,y:0,z:0,door:"1111",title:"test", color:"", levels:"1111"}]);

    Test("1111", maze.explored[0].door);
    Test("111110", maze.CreateRoom({x: 1, y:0, z:0}, zero).door);
    Test("111101", maze.CreateRoom({x:1, y:0, z:1}, {x:1, y:0, z:0}).door);
}


function MazeZTest() {
    let maze = new MazeGenerator(selector, [rm("stairwell", "011011", "1111", false)]);

    Test("1010", maze.Rotate(2, "1010")[0]);
    Test("1010", maze.Rotate(2, "0101")[0]);
    Test("0101", maze.Rotate(1, "0101")[0]);
    Test("0101", maze.Rotate(1, "1010")[0]);

    Test("0011", maze.Rotate(2, "1100")[0]);
    Test("001111", maze.Rotate(2, "110011")[0]);

    
    maze.Start([{x:0,y:0,z:0,door:"1111",title:"test", color:"", levels:"1111"}]);

    let pos = { x: 0, y: 1, z: 0 };
    Test("011011", maze.CreateRoom(pos, zero).door);

    let pos1 = { x: 0, y: 1, z: 1 };
    Test("011011", maze.CreateRoom(pos1, pos).door);

    //rotation test
    let pos2 = { x: 1, y: 1, z: 1 };
    Test("110011", maze.CreateRoom(pos2, pos1).door);
}


function rt(x: number,y: number,z: number,door: string): { x: number; y: number; z: number; door: string; title: string; color: string; count: number; isFinite: boolean; levels: string} {
    return {x: x, y: y, z: z, door: door, title: "", color: "", count: 1, isFinite: true, levels: "1111" };
}
function pos(x:  number,y: number,z: number): IDirection {
    return {x:x,y:y,z:z};
}

function Try<T,E>(expected: E,func: () => T, becauseOf?: string){
    let err = null;
    try {
        func();
    } catch (error) {
        err = error;
    }
    Test(expected, err, becauseOf);
}

function MazeUpDownTest() {
    let maze = new MazeGenerator(selector, []);

    let main = rt(1,0,1, "1111");
    let landing = rt(1,0,0, "111110");

    maze.explored.push(main);
    maze.explored.push(landing);

    Try("invalid move", () => maze.CreateRoom(main, landing), "moving from landing to main");
    Try("invalid move", () => maze.CreateRoom(landing, main), "moving from main to landing");
}

function MazeUpDownTest1() {
    let maze = new MazeGenerator(selector, []);

    let main = rt(1,0,1, "1111");
    let landing = rt(1,0,0, "111110");

    maze.rooms.push(main);
    maze.explored.push(main);
    maze.explored.push(landing);

    Try("invalid move", () => maze.CreateRoom(main, landing), "moving from landing to main");
    Try("invalid move", () => maze.CreateRoom(landing, main), "moving from main to landing");
}

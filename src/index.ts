import { IsBlocked, dirChecks } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";
import { MazeCanvasRenderer } from "./CanvasUI";
import { RunTests } from "./UnitTest";
import { MazeController } from "./MazeController";
import { IRoom, IRoomTemplate } from "./Interfaces/IRoom";
//import { rooms } from "./Rooms";
import { RandomSelector } from "./Selector";
import { gameRooms, special } from "./Rooms";

//RunTests();
export function CreateBasicMaze(){
    let s = Math.floor( Math.random() * 1000 ) + 1;
    let selector = new RandomSelector(s);
    
    let maze = new MazeGenerator(selector, gameRooms);
    
    let ui = new MazeCanvasRenderer("canvas", 400, 400);
    
    let controller = new MazeController(maze, ui);
    
    let red = "#fff090"
    
    let startingRooms: IRoom[] = [
        {x:0,y:0,z:1,title:"Entrance Hall", door:"1111", color: red, levels: "0100"},
        {x:0,y:1,z:1,title:"Foyer", door:"1111", color: red, levels: "0100"},
        {x:0,y:2,z:1,title:"Grand Staircase", door:"010010", color: red, levels: "0100"},
        {x:0,y:2,z:2,title:"Upper Landing", door:"111111", color: red, levels: "0010"},
        {x:0,y:2,z:3,title:"Roof Landing", door:"111101", color: red, levels: "0001"},
        {x:0,y:2,z:0,title:"Basement Landing", door:"1111", color: red, levels: "1000"},
    ];
    
    controller.Start({x:0,y:0,z:1},startingRooms);
     
}

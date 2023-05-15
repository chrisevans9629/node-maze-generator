import { IsBlocked, dirChecks } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";
import { MazeCanvasRenderer } from "./CanvasUI";
import { RunTests } from "./UnitTest";
import { MazeController } from "./MazeController";
import { IRoomTemplate } from "./Interfaces/IRoom";
import { rooms } from "./Rooms";

RunTests();

let s = 709;//Math.floor( Math.random() * 1000 ) + 1;
//console.log("seed", s);

let maze = new MazeGenerator(s, rooms);

let ui = new MazeCanvasRenderer("canvas", 400, 400);

let controller = new MazeController(maze, ui);

controller.Start();

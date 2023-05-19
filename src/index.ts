import { DirectionName } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";
import { MazeCanvasRenderer } from "./CanvasUI";
import { MazeController } from "./MazeController";
import { IRoom } from "./Interfaces/IRoom";
//import { rooms } from "./Rooms";
import { RandomSelector } from "./Selector";
import { gameRooms } from "./Rooms";

//RunTests();
export function CreateBasicMaze(id: string) {
    let s = Math.floor(Math.random() * 1000) + 1;
    let selector = new RandomSelector(s);

    let maze = new MazeGenerator(selector, gameRooms);

    let ui = new MazeCanvasRenderer(id, 400, 400);

    let controller = new MazeController(maze, ui);

    let header = document.getElementById("header");

    controller.updateHeader = (s) => {
        if(header){
            header.textContent = s;
        }
    };

    let moves = new Map<number, DirectionName>();
    moves.set(100, DirectionName.Left);
    moves.set(104, DirectionName.Foreward);
    moves.set(102, DirectionName.Right);
    moves.set(101, DirectionName.Backward);
    moves.set(103, DirectionName.Up);
    moves.set(97, DirectionName.Down);

    document.addEventListener("keydown", function (event) {
        if(moves.has(event.keyCode)){
            let move = moves.get(event.keyCode);
            if(!move){
                return;
            }
            let result = controller.Move(move);
            result?.routes.forEach(r => {
                let btn = document.getElementById(r.name.toString().toLowerCase()) as HTMLButtonElement;
                if(btn){
                    btn.disabled = r.disabled;
                }
            });
        }
    });

    let red = "#fff090"

    let startingRooms: IRoom[] = [
        { x: 0, y: 0, z: 1, title: "Entrance Hall", door: "1111", color: red, levels: "0100" },
        { x: 0, y: 1, z: 1, title: "Foyer", door: "1111", color: red, levels: "0100" },
        { x: 0, y: 2, z: 1, title: "Grand Staircase", door: "010010", color: red, levels: "0100" },
        { x: 0, y: 2, z: 2, title: "Upper Landing", door: "111111", color: red, levels: "0010" },
        { x: 0, y: 2, z: 3, title: "Roof Landing", door: "111101", color: red, levels: "0001" },
        { x: 0, y: 2, z: 0, title: "Basement Landing", door: "1111", color: red, levels: "1000" },
    ];

    controller.Start({ x: 0, y: 0, z: 1 }, startingRooms);

}

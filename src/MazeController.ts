import { MazeCanvasRenderer } from "./CanvasUI";
import { IsBlocked, dirChecks } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IRoom } from "./Interfaces/IRoom";
import { MazeGenerator } from "./MazeGenerator";

export class MazeController {
    position: IDirection;
    maze: MazeGenerator;
    ui: MazeCanvasRenderer;
    constructor(maze: MazeGenerator, ui: MazeCanvasRenderer) {
        this.maze = maze;
        this.ui = ui;
        this.position = {x:0, y:0, z:0};
    }

    Start() {
        this.maze.CreateRoom(this.position, this.position);
        this.ui.Draw(this.maze, this.position);

        let control = this;

        let leftBtn = document.getElementById("left") as HTMLButtonElement;
        let rightBtn = document.getElementById("right") as HTMLButtonElement;
        let forewardBtn = document.getElementById("foreward") as HTMLButtonElement;
        let backBtn = document.getElementById("backward") as HTMLButtonElement;
        let upBtn = document.getElementById("up") as HTMLButtonElement;
        let downBtn = document.getElementById("down") as HTMLButtonElement;


        let header = document.getElementById("header");
        document.addEventListener("keydown", function (event) {
            let delta = {x: control.position.x, y: control.position.y, z: control.position.z};
            console.log(event.keyCode);
            if (event.keyCode === 100 && !leftBtn.disabled) {
                delta.x--;
            } else if (event.keyCode === 104 && !forewardBtn.disabled) {
                delta.y--;
            } else if (event.keyCode === 102 && !rightBtn.disabled) {
                delta.x++;
            } else if (event.keyCode === 101 && !backBtn.disabled) {
                delta.y++;
            } else if (event.keyCode === 103 && !upBtn.disabled){
                delta.z++;
            } else if (event.keyCode === 97 && !downBtn.disabled){
                delta.z--;
            }

            if (delta.x == control.position.x && delta.y == control.position.y && delta.z == control.position.z) {
                return;
            }

            let pd = control.maze.CreateRoom(delta, control.position);
            control.UpdateAvailableRoutes(delta, pd);
            control.position.x = delta.x;
            control.position.y = delta.y;
            control.position.z = delta.z;
            control.ui.Draw(control.maze, control.position);
            header.textContent = `Floor ${pd.z} ${pd.title}`;
        });

    }

    private UpdateAvailableRoutes(dir: IDirection, pd: IRoom) {
        dirChecks.forEach(d => {
            let cd = { x: dir.x, y: dir.y, door: pd.door, title: pd.title, z: dir.z };

            let cx = dir.x + d.delta[0];
            let cy = dir.y + d.delta[1];
            let cz = dir.z + d.delta[2];

            let cPos = {x: cx, y: cy, z: cz};

            let ch = this.maze.GetExplored(cPos);

            if (!ch) {
                ch = { x: cx, y: cy, door: "1111", title: "default", color: "white", z: cPos.z };
            }

            let btn = document.getElementById(d.name.toString().toLowerCase()) as HTMLButtonElement;

            let isBlocked = IsBlocked(cd, ch);

            btn.disabled = isBlocked !== null;

        });
    }
}
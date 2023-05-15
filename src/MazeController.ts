import { MazeCanvasRenderer } from "./CanvasUI";
import { IsBlocked, dirChecks } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";

export class MazeController {
    x = 0;
    y = 0;
    maze: MazeGenerator;
    ui: MazeCanvasRenderer;
    constructor(maze: MazeGenerator, ui: MazeCanvasRenderer) {
        this.maze = maze;
        this.ui = ui;
    }

    Start() {
        this.maze.CreateRoom(this.x, this.y, this.x, this.y);
        this.ui.Draw(this.maze, this.x, this.y);

        let control = this;

        let leftBtn = document.getElementById("left") as HTMLButtonElement;
        let rightBtn = document.getElementById("right") as HTMLButtonElement;
        let upBtn = document.getElementById("up") as HTMLButtonElement;
        let downBtn = document.getElementById("down") as HTMLButtonElement;
        let header = document.getElementById("header");
        document.addEventListener("keydown", function (event) {
            let px = control.x;
            let py = control.y;
            let dx = control.x;
            let dy = control.y;
            if (event.keyCode === 37 && !leftBtn.disabled) {
                dx--;
            } else if (event.keyCode === 38 && !upBtn.disabled) {
                dy--;
            } else if (event.keyCode === 39 && !rightBtn.disabled) {
                dx++;
            } else if (event.keyCode === 40 && !downBtn.disabled) {
                dy++;
            }

            if (dx == px && dy == py) {
                return;
            }

            let pd = control.maze.CreateRoom(dx, dy, px, py);
            dirChecks.forEach(d => {
                let cd = { x: dx, y: dy, door: pd.door, title: pd.title };

                let cx = dx + d.delta[0];
                let cy = dy + d.delta[1];

                let ch = control.maze.GetPrevious(cx, cy);

                if (!ch) {
                    ch = { x: cx, y: cy, door: "1111", title: "default", color: "white" };
                }

                let btn = document.getElementById(d.name) as HTMLButtonElement;

                let isBlocked = IsBlocked(cd, ch);

                //console.log(d.name," isBlocked(",cd, ch,") = ", isBlocked)

                btn.disabled = isBlocked !== null;

            });
            control.x = dx;
            control.y = dy;
            control.ui.Draw(control.maze, control.x, control.y);
            header.textContent = pd.title;
        });

    }
}
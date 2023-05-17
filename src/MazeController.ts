import { MazeCanvasRenderer } from "./CanvasUI";
import { IsBlocked, dirChecks } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IDoor } from "./Interfaces/IDoor";
import { IRoom } from "./Interfaces/IRoom";
import { MazeGenerator } from "./MazeGenerator";

export class MazeController {
    position: IDirection;
    maze: MazeGenerator;
    ui: MazeCanvasRenderer;
    actions: {disabled:boolean, id: string}[];
    constructor(maze: MazeGenerator, ui: MazeCanvasRenderer) {
        this.maze = maze;
        this.ui = ui;

    }

    Start(position: IDirection, startingRooms: IRoom[]) {
        this.position = position;
        this.maze.Start(startingRooms);
        this.ui.Draw(this.maze, this.position);

        let control = this;

        let leftBtn =       { disabled: false, id:"left" };//document.getElementById("left") as HTMLButtonElement;
        let rightBtn =      { disabled: false, id:"right" };//document.getElementById("right") as HTMLButtonElement;
        let forewardBtn =   { disabled: false, id:"foreward" };//document.getElementById("foreward") as HTMLButtonElement;
        let backBtn =       { disabled: false, id:"backward" };//document.getElementById("backward") as HTMLButtonElement;
        let upBtn =         { disabled: false, id:"up" };//document.getElementById("up") as HTMLButtonElement;
        let downBtn =       { disabled: false, id:"down" };//document.getElementById("down") as HTMLButtonElement;

        this.actions = [leftBtn, rightBtn, forewardBtn, backBtn, upBtn, downBtn];

        let header = document.getElementById("header");
        document.addEventListener("keydown", function (event) {
            let delta = { x: control.position.x, y: control.position.y, z: control.position.z };
            //console.log(event.keyCode);
            if (event.keyCode === 100 && !leftBtn.disabled) {
                delta.x--;
            } else if (event.keyCode === 104 && !forewardBtn.disabled) {
                delta.y--;
            } else if (event.keyCode === 102 && !rightBtn.disabled) {
                delta.x++;
            } else if (event.keyCode === 101 && !backBtn.disabled) {
                delta.y++;
            } else if (event.keyCode === 103 && !upBtn.disabled) {
                delta.z++;
            } else if (event.keyCode === 97 && !downBtn.disabled) {
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
            if(header){
                header.textContent = `Floor ${pd.z} ${pd.title}`;
            }
        });

    }

    private UpdateAvailableRoutes(dir: IDirection, pd: IRoom) {
        dirChecks.forEach(d => {
            let cd = { x: dir.x, y: dir.y, door: pd.door, title: pd.title, z: dir.z };

            let cx = dir.x + d.delta[0];
            let cy = dir.y + d.delta[1];
            let cz = dir.z + d.delta[2];

            let cPos = { x: cx, y: cy, z: cz };

            let ch: IDoor = this.maze.GetExplored(cPos);

            if (!ch) {
                ch = { x: cx, y: cy, z: cPos.z, door: "111111" };
            }

            let btn = document.getElementById(d.name.toString().toLowerCase()) as HTMLButtonElement;
            let action = this.actions.filter(a => a.id == d.name)[0];
            let isBlocked = IsBlocked(cd, ch);

            if(btn){
                btn.disabled = isBlocked !== null;
            }
            action.disabled = isBlocked !== null;

        });
    }
}
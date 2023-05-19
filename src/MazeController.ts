import { MazeCanvasRenderer } from "./CanvasUI";
import { DirectionName, IsBlocked, dirChecks } from "./Helpers";
import { IDirection } from "./Interfaces/IDirection";
import { IDoor } from "./Interfaces/IDoor";
import { IRoom } from "./Interfaces/IRoom";
import { MazeGenerator } from "./MazeGenerator";

export class MazeController {
    position: IDirection;
    maze: MazeGenerator;
    ui: MazeCanvasRenderer;
    actions: {disabled:boolean, id: string}[];
    updateHeader: ((header: string) => void) | undefined;
    leftBtn =       { disabled: false, id:"left" };     
    rightBtn =      { disabled: false, id:"right" };    
    forewardBtn =   { disabled: false, id:"foreward" }; 
    backBtn =       { disabled: false, id:"backward" }; 
    upBtn =         { disabled: false, id:"up" };       
    downBtn =       { disabled: false, id:"down" }; 
    constructor(maze: MazeGenerator, ui: MazeCanvasRenderer) {
        this.maze = maze;
        this.ui = ui;
        this.actions = [this.leftBtn, this.rightBtn, this.forewardBtn, this.backBtn, this.upBtn, this.downBtn];
        this.position = {x: 0, y:0, z:0};
    }

    Start(position: IDirection, startingRooms: IRoom[]) {
        this.position = position;
        this.maze.Start(startingRooms);
        this.ui.Draw(this.maze, this.position);

        //let header = document.getElementById("header");

        let pd = this.maze.GetExplored(this.position);
        if(this.updateHeader){
            this.updateHeader(`Floor ${pd?.z} ${pd?.title}`);
        }

        // document.addEventListener("keydown", function (event) {
            
        // });

    }

    Move(action: DirectionName){
        let control = this;
        let delta = { x: control.position.x, y: control.position.y, z: control.position.z };
        //console.log(event.keyCode);
        if (action === DirectionName.Left && !this.leftBtn.disabled) {
            delta.x--;
        } else if (action === DirectionName.Foreward && !this.forewardBtn.disabled) {
            delta.y--;
        } else if (action === DirectionName.Right && !this.rightBtn.disabled) {
            delta.x++;
        } else if (action === DirectionName.Backward && !this.backBtn.disabled) {
            delta.y++;
        } else if (action === DirectionName.Up && !this.upBtn.disabled) {
            delta.z++;
        } else if (action === DirectionName.Down && !this.downBtn.disabled) {
            delta.z--;
        }

        // if (event.keyCode === 100 && !leftBtn.disabled) {
        //     delta.x--;
        // } else if (event.keyCode === 104 && !forewardBtn.disabled) {
        //     delta.y--;
        // } else if (event.keyCode === 102 && !rightBtn.disabled) {
        //     delta.x++;
        // } else if (event.keyCode === 101 && !backBtn.disabled) {
        //     delta.y++;
        // } else if (event.keyCode === 103 && !upBtn.disabled) {
        //     delta.z++;
        // } else if (event.keyCode === 97 && !downBtn.disabled) {
        //     delta.z--;
        // }

        if (delta.x == control.position.x && delta.y == control.position.y && delta.z == control.position.z) {
            return;
        }

        let pd = control.maze.CreateRoom(delta, control.position);
        let result = control.UpdateAvailableRoutes(delta, pd);
        control.position.x = delta.x;
        control.position.y = delta.y;
        control.position.z = delta.z;
        control.ui.Draw(control.maze, control.position);
        if(control.updateHeader){
            control.updateHeader(`Floor ${pd.z} ${pd.title}`);
        }
        return {room: pd, routes: result};
    }

    private UpdateAvailableRoutes(dir: IDirection, pd: IRoom) {
        return dirChecks.map(d => {
            let cd = { x: dir.x, y: dir.y, door: pd.door, title: pd.title, z: dir.z };

            let cx = dir.x + d.delta[0];
            let cy = dir.y + d.delta[1];
            let cz = dir.z + d.delta[2];

            let cPos = { x: cx, y: cy, z: cz };

            let ch: IDoor | null = this.maze.GetExplored(cPos);

            if (!ch) {
                ch = { x: cx, y: cy, z: cPos.z, door: "111111" };
            }

            //let btn = document.getElementById(d.name.toString().toLowerCase()) as HTMLButtonElement;
            let action = this.actions.filter(a => a.id == d.name)[0];
            let isBlocked = IsBlocked(cd, ch);

            // if(btn){
            //     btn.disabled = isBlocked !== null;
            // }
            action.disabled = isBlocked !== null;
            return {disabled: action.disabled, name: d.name};
        });
    }
}
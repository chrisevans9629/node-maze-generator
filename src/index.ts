import { IsBlocked, dirChecks } from "./Helpers";
import { MazeGenerator } from "./MazeGenerator";
import { Draw, DrawDot } from "./UI";
import { RunTests } from "./UnitTest";

RunTests();

let s = 709;//Math.floor( Math.random() * 1000 ) + 1;
console.log("seed", s);

let roomNames = ['Hallway', 'Ground Floor Staircase', 'Upper Landing', 'Basement Landing', 'Armory', 'Ballroom', 'Bloody Room', 'Catacombs', 'Chapel', 'Charred Room', 'Chasm', 'Collapsed Room', 'Conservatory', 'Cramped Passageway', 'Crawlspace', 'Dining Room', 'Furnace Room', 'Gallery', 'Game Room', 'Graveyard', 'Guest Quarters', 'Gymnasium', 'Junk Room', 'Kitchen', 'Laboratory', 'Larder', 'Laundry Chute', 'Library', 'Mystic Elevator', 'Nursery', 'Observatory', 'Operating Theatre', 'Organ Room', 'Oubliette\n(Blood on the Moon)', 'Panic Room', 'Primary Bedroom', 'Ritual Room', 'Salon', 'Secret Staircase', 'Soundproofed Room', 'Specimen Room', 'Statuary Corridor', 'Tower', 'Trophy Room\n(Blood on the Moon)', 'Underground Cavern', 'Underground Lake', 'Vault', 'Winter Bedroom'];

function CreateRoomTemplate(name: string){
    return {door: "1111", title:name, isFinite: true, count:1};
}

let rooms = [];

roomNames.forEach(rm => {
    rooms.push(CreateRoomTemplate(rm));
});

// let rooms = [
//     { door: "1111", title: "Ballroom", isFinite: true, count: 1 },
//     { door: "0111", title: "Charred Room", isFinite: true, count: 1 },
//     { door: "1010", title: "Chapel", isFinite: true, count: 1 },
//     { door: "1000", title: "Graveyard", isFinite: true, count: 1 },
//     { door: "1100", title: "Corner Hallway", isFinite: false, count: 1 },
//     { door: "1100", title: "Hallway", isFinite: false, count: 1 }
// ];

let maze = new MazeGenerator(s, rooms);

//must connect to a revealed room. older rooms take precedent.
let x = 0;
let y = 0;

let leftBtn = document.getElementById("left") as HTMLButtonElement;
let rightBtn = document.getElementById("right") as HTMLButtonElement;
let upBtn = document.getElementById("up") as HTMLButtonElement;
let downBtn = document.getElementById("down") as HTMLButtonElement;
let header = document.getElementById("header");
document.addEventListener("keydown", function (event) {
    let px = x;
    let py = y;
    let dx = x;
    let dy = y;
    if (event.keyCode === 37 && !leftBtn.disabled) {
        // Left arrow key pressed
        console.log("Left arrow key pressed");
        dx--;
    } else if (event.keyCode === 38 && !upBtn.disabled) {
        // Up arrow key pressed
        console.log("Up arrow key pressed");
        dy--;
    } else if (event.keyCode === 39 && !rightBtn.disabled) {
        // Right arrow key pressed
        console.log("Right arrow key pressed");
        dx++;
    } else if (event.keyCode === 40 && !downBtn.disabled) {
        // Down arrow key pressed
        console.log("Down arrow key pressed");
        dy++;
    }

    if (dx == px && dy == py) {
        return;
    }

    console.log(dx, dy, px, py);
    let pd = maze.CreateRoom(dx, dy, px, py);
    DrawDot(px, py, "white");
    DrawDot(dx, dy, "red");
    dirChecks.forEach(d => {
        let cd = { x: dx, y: dy, door: pd.door, title: pd.title };

        let cx = dx + d.delta[0];
        let cy = dy + d.delta[1];

        let ch = maze.GetPrevious(cx, cy);

        if (!ch) {
            ch = { x: cx, y: cy, door: "1111", title: "default" };
        }


        let btn = document.getElementById(d.name) as HTMLButtonElement;

        let isBlocked = IsBlocked(cd, ch);

        //console.log(d.name," isBlocked(",cd, ch,") = ", isBlocked)

        btn.disabled = isBlocked !== null;

    });
    x = dx;
    y = dy;
    Draw(maze, x, y);
    header.textContent = pd.title;
});


maze.CreateRoom(x, y, x, y);

Draw(maze, x, y);


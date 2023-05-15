import { IRoomTemplate } from "./Interfaces/IRoom";

let special = "#a0d129";
let normal = "white";

let roomNames = ['Hallway', 'Ground Floor Staircase', 'Upper Landing', 'Basement Landing', 'Armory', 'Ballroom', 'Bloody Room', 'Catacombs', 'Chapel', 'Charred Room', 'Chasm', 'Collapsed Room', 'Conservatory', 'Cramped Passageway', 'Crawlspace', 'Dining Room', 'Furnace Room', 'Gallery', 'Game Room', 'Graveyard', 'Guest Quarters', 'Gymnasium', 'Junk Room', 'Kitchen', 'Laboratory', 'Larder', 'Laundry Chute', 'Library', 'Mystic Elevator', 'Nursery', 'Observatory', 'Operating Theatre', 'Organ Room', 'Oubliette\n(Blood on the Moon)', 'Panic Room', 'Primary Bedroom', 'Ritual Room', 'Salon', 'Secret Staircase', 'Soundproofed Room', 'Specimen Room', 'Statuary Corridor', 'Tower', 'Trophy Room\n(Blood on the Moon)', 'Underground Cavern', 'Underground Lake', 'Vault', 'Winter Bedroom'];


export function rm(name: string, door: string, finite?: boolean, count?: number): IRoomTemplate {
    if (count === undefined)
        count = 1;
    if (finite === undefined)
        finite = true;
    return { door: door, title: name, isFinite: finite, count: count, color: finite ? special : normal };
}

export let rooms = [
    rm("Main Landing", "1010"),
    rm("Ballroom", "1111"),
    rm("Charred Room", "0111"),
    rm("Chapel", "0001"),
    rm("Graveyard", "0111"),
    rm("Corner Hallway", "1100", false),
    rm("Hallway", "1010", false),
    rm("Fourway", "1111", false)
];
import { IRoomTemplate } from "./Interfaces/IRoom";

export let special = "#a0d129";
let normal = "white";

let roomNames = ['Hallway', 'Ground Floor Staircase', 'Upper Landing', 'Basement Landing', 'Armory', 'Ballroom', 'Bloody Room', 'Catacombs', 'Chapel', 'Charred Room', 'Chasm', 'Collapsed Room', 'Conservatory', 'Cramped Passageway', 'Crawlspace', 'Dining Room', 'Furnace Room', 'Gallery', 'Game Room', 'Graveyard', 'Guest Quarters', 'Gymnasium', 'Junk Room', 'Kitchen', 'Laboratory', 'Larder', 'Laundry Chute', 'Library', 'Mystic Elevator', 'Nursery', 'Observatory', 'Operating Theatre', 'Organ Room', 'Oubliette\n(Blood on the Moon)', 'Panic Room', 'Primary Bedroom', 'Ritual Room', 'Salon', 'Secret Staircase', 'Soundproofed Room', 'Specimen Room', 'Statuary Corridor', 'Tower', 'Trophy Room\n(Blood on the Moon)', 'Underground Cavern', 'Underground Lake', 'Vault', 'Winter Bedroom'];


export function rm(name: string, door: string, levels: string, finite?: boolean, count?: number): IRoomTemplate {
    if (count === undefined)
        count = 1;
    if (finite === undefined)
        finite = false;

    let color = normal;

    if(finite)
        color = special;
    if(door.length > 4)
        color = "#ff8800";

    return { door: door, title: name, isFinite: finite, count: count, color: color, levels: levels };
}
 
export let rooms = [
    rm("Main Landing", "1010", "1111"),
    rm("Ballroom", "1111", "1111"),
    rm("Charred Room", "0111", "1111"),
    rm("Chapel", "0001", "1111"),
    rm("Graveyard", "0111", "1111"),
    rm("Corner Hallway", "1100", "1111", false),
    rm("Hallway", "1010", "1111", false),
    rm("Fourway", "1111", "1111", false),
    rm("stairwell", "111110", "1111", false),
    rm("upper landing", "111101", "1111", false)
];


export let gameRooms = [
    //rm("Entrance Hall","1111","0100"),
    //rm("Foyer","1111","0100"),
    //rm("Grand Staircase","100010","0100"),
    rm("Graveyard","1000","0100"),
    rm("Coal Chute","100001","0100"),
    rm("Patio","1110","0100"),
    rm("Dining Room","1100","0100"),
    rm("Gardens","1010","0100"),
    rm("Ballroom","1111","0100"),
    rm("Tree House","1100","0100"),
    rm("Catacombs","1010","1000"),
    rm("Underground Lake","1100","1000"),
    rm("Crypt","1000","1000"),
    //rm("Basement Landing","1111","1000"),
    rm("Storm Cellar","1100","1000"),
    rm("Stairs From Basement","100010","1000"),
    rm("Furnace Room","1110","1000"),
    rm("Cave","1111","1000"),
    rm("Chasm","1010","1000"),
    rm("Larder","1010","1000"),
    rm("Pentagram","1000","1000"),
    rm("Dungeon","1010","1000"),
    rm("Wine Cellar ","1010","1000"),
    //rm("Upper Landing","1111","0010"),
    rm("Tower","1010","0011"),
    rm("Master Bedroom","1100","0011"),
    rm("Bedroom","1010","0011"),
    rm("Gallery","1010","0011"),
    rm("Attic","1000","0011"),
    rm("Balcony","1010","0011"),
    rm("Kitchen","1100","1100"),
    rm("Abandoned Room","1111","1100"),
    rm("Menagerie","1010","1100"),
    rm("Arsenal","1100","1100"),
    rm("Laundry","1100","1100"),
    rm("Theater","1010","0111"),
    rm("Collapsed Room","1111","0111"),
    rm("Charred Room","1111","0111"),
    rm("Library","1100","0111"),
    rm("Bloody Room","1111","0111"),
    rm("Chapel","1000","0111"),
    rm("Conservatory","1000","0111"),
    rm("Bathroom","1000","0111"),
    rm("Study","1100","0111"),
    rm("Spiral Staircase","111111","0100"),
    rm("Junk Room","1111","1111"),
    rm("Game Room","1110","1111"),
    rm("Organ Room","1100","1111"),
    rm("Creaky Hallway","1111","1111"),
    rm("Dusty Hallway","1111","1111"),
    rm("Statuary Corridor","1010","1111"),
    rm("Mystic Elevator","1000","1111"),
    rm("Solarium","1000","0011"),
    rm("Nursery","1100","0011"),
    rm("Widow's Walk","1110","0011"),
    rm("Sewing Room","1111","0011"),
    rm("Drawing Room","1111","0011"),
    rm("Locked Room","1110","1011"),
    rm("Panic Room","1000","1111"),
    rm("Servants' Quarters","1111","1011"),
    rm("Gymnasium","1100","1011"),
    rm("Storeroom","1000","1011"),
    rm("Operating Laboratory","1100","1011"),
    rm("Research Laboratory","1010","1011"),
    rm("Vault","1000","1011"),
    //rm("Roof Landing","1111","0001"),
    rm("Rookery","1010","0001"),
];
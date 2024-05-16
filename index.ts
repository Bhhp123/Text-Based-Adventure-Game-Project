import inquirer from 'inquirer';

let currentRoom: string | undefined = 'hall';

console.log('\n\t\x1b[41m-----------------------------------------------------\x1b[0m');
console.log('\t\x1b[31m\x1b[2m Bilawal Hussain\'s Text Based Adventure Game Project \x1b[0m');
console.log('\t\x1b[41m-----------------------------------------------------\x1b[0m');

interface Room {
  description: string;
  actions: { [key: string]: () => void };
  enemy?: {
    name: string;
    health: number;
    damage: number;
  };
}

const rooms: { [key: string]: Room } = {
  hall: {
    description: `\x1b[36mYou are in a grand hall.\x1b[0m`,
    actions: {
      goNorth: () => moveRoom("kitchen"),
      goSouth: () => moveRoom("garden"),
      exit: () => process.exit(0),
    },
  },
  kitchen: {
    description: `\x1b[33mYou are in a cozy kitchen.\x1b[0m`,
    actions: {
      goSouth: () => moveRoom("hall"),
      exit: () => process.exit(0),
    },
    enemy: {
      name: "Orc",
      health: 10,
      damage: 2,
    },
  },
  garden: {
    description: `\x1b[32mYou are in a beautiful garden.\x1b[0m`,
    actions: {
      goNorth: () => moveRoom("hall"),
      exit: () => process.exit(0),
    },
  },
};

function moveRoom(roomName: string) {
  if (rooms[roomName]) {
    currentRoom = roomName;
    describeRoom();
  } else {
    console.log("You can't go that way.");
  }
}

function describeRoom() {
  if (currentRoom !== undefined) {
    console.log(rooms[currentRoom].description);
    console.log("Actions:");
    Object.keys(rooms[currentRoom].actions).forEach((action) => {
      console.log(`  * \x1b[35m${action}\x1b[0m`);
    });
    if (rooms[currentRoom].enemy) {
      console.log(`Enemy: \x1b[31m${rooms[currentRoom].enemy!.name}\x1b[0m (Health: \x1b[31m${rooms[currentRoom].enemy!.health}\x1b[0m)`);
    }
  } else {
    console.log("Room not found.");
  }
  askAction();
}

async function askAction() {
  if (currentRoom !== undefined) {
    const answers = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: Object.keys(rooms[currentRoom].actions),
    });
    if (rooms[currentRoom].actions[answers.action]) {
      rooms[currentRoom].actions[answers.action]();
    } else {
      console.log("Invalid action. Try again.");
      askAction();
    }
  } else {
    console.log("Room not found.");
  }
}

function attackEnemy() {
  if (currentRoom !== undefined && rooms[currentRoom].enemy) {
    rooms[currentRoom].enemy!.health -= 2;
    console.log(`You attacked the \x1b[31m${rooms[currentRoom].enemy!.name}\x1b[0m for 2 damage!`);
    if (rooms[currentRoom].enemy!.health <= 0) {
      console.log(`You defeated the \x1b[31m${rooms[currentRoom].enemy!.name}\x1b[0m!`);
      delete rooms[currentRoom].enemy;
    } else {
      console.log(`The \x1b[31m${rooms[currentRoom].enemy!.name}\x1b[0m retaliates for \x1b[31m${rooms[currentRoom].enemy!.damage}\x1b[0m damage!`);
    }
  }
  askAction();
}

describeRoom();
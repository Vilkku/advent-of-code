import { inputToIntcodeComputerMemory } from "../util/input.js";
import { type Command, run } from "./funcs.ts";

const outputContainer = document.getElementById("output") as HTMLDivElement;
const inventoryContainer = document.getElementById("items") as HTMLUListElement;
const programInput = document.getElementById("program") as HTMLTextAreaElement;
const runButton = document.getElementById("run") as HTMLButtonElement;

const dangerousItems = [
  "escape pod",
  "giant electromagnet",
  "infinite loop",
  "molten lava",
  "photons",
];

// easter egg, tambourine, astronaut ice cream, mutex

runButton.addEventListener("click", async () => {
  const initialMemory = inputToIntcodeComputerMemory(programInput.value);
  const roomMap: Record<string, Record<string, string | undefined>> = {};
  let prevRoom: Record<string, string | undefined> | undefined = undefined;
  let prevRoomTitle: string | undefined = undefined;
  let prevDirection: string | undefined = undefined;

  function roomContainsUnexploredRooms(
    checkedRooms: string[],
    linkedRoom: string,
  ): boolean {
    if (!roomMap[linkedRoom]) {
      return true;
    }

    const linkedRoomsWithoutCurrentRoom = Object.values(
      roomMap[linkedRoom],
    ).filter((room) => room === undefined || !checkedRooms.includes(room));

    if (linkedRoomsWithoutCurrentRoom.length === 0) {
      return false;
    }

    return linkedRoomsWithoutCurrentRoom.some((room) =>
      room === undefined
        ? true
        : roomContainsUnexploredRooms([linkedRoom, ...checkedRooms], room),
    );
  }

  await run(initialMemory, {
    onInput: async (outputs, inventory): Promise<Command> => {
      outputContainer.textContent = "";
      const lastRoomIndex = outputs.findLastIndex(
        (output) => output.type === "room",
      );

      const lastOutput = outputs[lastRoomIndex];
      let currentRoom: Record<string, undefined> | undefined = undefined;

      if (lastOutput?.type === "room") {
        currentRoom = {};
        lastOutput.doors.forEach((dir) => {
          currentRoom![dir] = undefined;
        });
      }

      if (
        prevRoom &&
        prevRoomTitle &&
        prevDirection &&
        lastOutput.type === "room" &&
        currentRoom &&
        prevRoomTitle !== lastOutput.title
      ) {
        const currentRoomTitle = lastOutput.title;
        const currentDirection = getOppositeDirection(prevDirection);

        if (!roomMap[prevRoomTitle]) {
          roomMap[prevRoomTitle] = prevRoom;
        }

        if (!roomMap[prevRoomTitle][prevDirection]) {
          roomMap[prevRoomTitle][prevDirection] = currentRoomTitle;
        }

        if (!roomMap[currentRoomTitle]) {
          roomMap[currentRoomTitle] = currentRoom;
        }

        if (!roomMap[currentRoomTitle][currentDirection]) {
          roomMap[currentRoomTitle][currentDirection] = prevRoomTitle;
        }
      }

      outputs.forEach((output, index) => {
        const sectionEl = createElement("div");

        if (output.type === "room") {
          const isLastRoom = lastRoomIndex === index;

          const titleEl = createElement("h2", { textContent: output.title });
          sectionEl.appendChild(titleEl);

          const descriptionEl = createElement("p", {
            className: "output-description",
            textContent: output.description,
          });
          sectionEl.appendChild(descriptionEl);

          const doorsContainerEl = createElement(
            "div",
            {
              className: "output-list output-doors",
            },
            [
              createElement("h3", { textContent: "Doors" }),
              createElement(
                "ul",
                {},
                output.doors.map((door) => {
                  const linkedRoomName = roomMap[output.title]?.[door];
                  const linkedRoomIsUnexplored = linkedRoomName
                    ? roomContainsUnexploredRooms(
                        [output.title],
                        linkedRoomName,
                      )
                    : true;

                  const id = `${output.title}-${door}`;

                  return createElement("li", {}, [
                    createElement("button", {
                      textContent: `${door} (${linkedRoomName ? `${linkedRoomName} - ${linkedRoomIsUnexplored ? "contains unvisited rooms" : "fully explored"}` : "unexplored"})`,
                      disabled: !isLastRoom,
                      "data-id": id,
                      "data-direction": door,
                    }),
                  ]);
                }),
              ),
            ],
          );

          sectionEl.appendChild(doorsContainerEl);

          if (output.items.length > 0) {
            const itemsContainerEl = document.createElement("div");
            itemsContainerEl.classList.add("output-list");
            itemsContainerEl.classList.add("output-items");

            const itemsHeaderEl = document.createElement("h3");
            itemsHeaderEl.textContent = "Items";

            itemsContainerEl.appendChild(itemsHeaderEl);

            const itemsListEl = document.createElement("ul");

            output.items.forEach((item) => {
              const isDangerous = dangerousItems.includes(item);

              const itemEl = document.createElement("li");

              const itemButton = document.createElement("button");
              itemButton.textContent = `${item}${isDangerous ? " (dangerous!)" : ""}`;
              itemButton.disabled =
                isDangerous || !isLastRoom || inventory.includes(item);

              itemEl.appendChild(itemButton);
              itemsListEl.appendChild(itemEl);
            });

            itemsContainerEl.appendChild(itemsListEl);
            sectionEl.appendChild(itemsContainerEl);
          }
        } else {
          const errorEl = document.createElement("h2");
          errorEl.classList.add(`output-${output.type}`);
          errorEl.textContent = output.description;
          sectionEl.appendChild(errorEl);
        }

        outputContainer.appendChild(sectionEl);
      });

      inventoryContainer.textContent = "";
      inventory.forEach((item) => {
        const itemEl = document.createElement("li");

        const itemTitleEl = document.createElement("span");
        itemTitleEl.textContent = item;
        itemEl.appendChild(itemTitleEl);

        const dropItemEl = document.createElement("button");
        dropItemEl.textContent = "Drop";
        dropItemEl.setAttribute("data-item", item);
        itemEl.appendChild(dropItemEl);

        inventoryContainer.appendChild(itemEl);
      });

      return new Promise((resolve) => {
        outputContainer
          .querySelectorAll(".output-doors button")
          .forEach((el) => {
            el.addEventListener("click", () => {
              const dir = el.getAttribute("data-direction") as Command;

              if (lastOutput?.type === "room") {
                prevRoom = currentRoom;
                prevRoomTitle = lastOutput.title;
                prevDirection = dir;
              }

              resolve(dir);
            });
          });

        outputContainer
          .querySelectorAll(".output-items button")
          .forEach((el) => {
            el.addEventListener("click", () => {
              resolve(`take ${el.textContent}` as Command);
            });
          });

        inventoryContainer.querySelectorAll("button").forEach((el) => {
          el.addEventListener("click", () => {
            resolve(`drop ${el.getAttribute("data-item")}`);
          });
        });
      });
    },
  });
});

function getOppositeDirection(dir: string): string {
  switch (dir) {
    case "north":
      return "south";
    case "east":
      return "west";
    case "south":
      return "north";
    case "west":
      return "east";
    default:
      throw new Error(`Unknown direction ${dir}`);
  }
}

function createElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  props: Record<string, string | boolean> = {},
  children: HTMLElement[] = [],
): HTMLElementTagNameMap[T] {
  const element = document.createElement(tagName);

  Object.entries(props).forEach(([name, value]) => {
    if (typeof value === "string") {
      switch (name) {
        case "textContent":
          element.textContent = value;
          break;
        case "className":
          element.classList.add(...value.split(" "));
          break;
        default:
          element.setAttribute(name, value);
          break;
      }
    } else {
      if (value) {
        element.setAttribute(name, "true");
      }
    }
  });

  children.forEach((child) => {
    element.appendChild(child);
  });

  return element;
}

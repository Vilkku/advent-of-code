// node:path
var L = Object.create;
var h = Object.defineProperty;
var D = Object.getOwnPropertyDescriptor;
var T = Object.getOwnPropertyNames;
var _ = Object.getPrototypeOf;
var E = Object.prototype.hasOwnProperty;
var R = (s, e) => () => (e || s((e = { exports: {} }).exports, e), e.exports);
var N = (s, e, r, t) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let i of T(e))
      !E.call(s, i) && i !== r && h(s, i, { get: () => e[i], enumerable: !(t = D(e, i)) || t.enumerable });
  return s;
};
var j = (s, e, r) => (r = s != null ? L(_(s)) : {}, N(e || !s || !s.__esModule ? h(r, "default", { value: s, enumerable: true }) : r, s));
var k = R((W, w) => {
  function v(s) {
    if (typeof s != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(s));
  }
  function C(s, e) {
    for (var r = "", t = 0, i = -1, a = 0, n, l = 0;l <= s.length; ++l) {
      if (l < s.length)
        n = s.charCodeAt(l);
      else {
        if (n === 47)
          break;
        n = 47;
      }
      if (n === 47) {
        if (!(i === l - 1 || a === 1))
          if (i !== l - 1 && a === 2) {
            if (r.length < 2 || t !== 2 || r.charCodeAt(r.length - 1) !== 46 || r.charCodeAt(r.length - 2) !== 46) {
              if (r.length > 2) {
                var f = r.lastIndexOf("/");
                if (f !== r.length - 1) {
                  f === -1 ? (r = "", t = 0) : (r = r.slice(0, f), t = r.length - 1 - r.lastIndexOf("/")), i = l, a = 0;
                  continue;
                }
              } else if (r.length === 2 || r.length === 1) {
                r = "", t = 0, i = l, a = 0;
                continue;
              }
            }
            e && (r.length > 0 ? r += "/.." : r = "..", t = 2);
          } else
            r.length > 0 ? r += "/" + s.slice(i + 1, l) : r = s.slice(i + 1, l), t = l - i - 1;
        i = l, a = 0;
      } else
        n === 46 && a !== -1 ? ++a : a = -1;
    }
    return r;
  }
  function F(s, e) {
    var r = e.dir || e.root, t = e.base || (e.name || "") + (e.ext || "");
    return r ? r === e.root ? r + t : r + s + t : t;
  }
  var m = { resolve: function() {
    for (var e = "", r = false, t, i = arguments.length - 1;i >= -1 && !r; i--) {
      var a;
      i >= 0 ? a = arguments[i] : (t === undefined && (t = process.cwd()), a = t), v(a), a.length !== 0 && (e = a + "/" + e, r = a.charCodeAt(0) === 47);
    }
    return e = C(e, !r), r ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
  }, normalize: function(e) {
    if (v(e), e.length === 0)
      return ".";
    var r = e.charCodeAt(0) === 47, t = e.charCodeAt(e.length - 1) === 47;
    return e = C(e, !r), e.length === 0 && !r && (e = "."), e.length > 0 && t && (e += "/"), r ? "/" + e : e;
  }, isAbsolute: function(e) {
    return v(e), e.length > 0 && e.charCodeAt(0) === 47;
  }, join: function() {
    if (arguments.length === 0)
      return ".";
    for (var e, r = 0;r < arguments.length; ++r) {
      var t = arguments[r];
      v(t), t.length > 0 && (e === undefined ? e = t : e += "/" + t);
    }
    return e === undefined ? "." : m.normalize(e);
  }, relative: function(e, r) {
    if (v(e), v(r), e === r || (e = m.resolve(e), r = m.resolve(r), e === r))
      return "";
    for (var t = 1;t < e.length && e.charCodeAt(t) === 47; ++t)
      ;
    for (var i = e.length, a = i - t, n = 1;n < r.length && r.charCodeAt(n) === 47; ++n)
      ;
    for (var l = r.length, f = l - n, c = a < f ? a : f, d = -1, o = 0;o <= c; ++o) {
      if (o === c) {
        if (f > c) {
          if (r.charCodeAt(n + o) === 47)
            return r.slice(n + o + 1);
          if (o === 0)
            return r.slice(n + o);
        } else
          a > c && (e.charCodeAt(t + o) === 47 ? d = o : o === 0 && (d = 0));
        break;
      }
      var A = e.charCodeAt(t + o), z = r.charCodeAt(n + o);
      if (A !== z)
        break;
      A === 47 && (d = o);
    }
    var b = "";
    for (o = t + d + 1;o <= i; ++o)
      (o === i || e.charCodeAt(o) === 47) && (b.length === 0 ? b += ".." : b += "/..");
    return b.length > 0 ? b + r.slice(n + d) : (n += d, r.charCodeAt(n) === 47 && ++n, r.slice(n));
  }, _makeLong: function(e) {
    return e;
  }, dirname: function(e) {
    if (v(e), e.length === 0)
      return ".";
    for (var r = e.charCodeAt(0), t = r === 47, i = -1, a = true, n = e.length - 1;n >= 1; --n)
      if (r = e.charCodeAt(n), r === 47) {
        if (!a) {
          i = n;
          break;
        }
      } else
        a = false;
    return i === -1 ? t ? "/" : "." : t && i === 1 ? "//" : e.slice(0, i);
  }, basename: function(e, r) {
    if (r !== undefined && typeof r != "string")
      throw new TypeError('"ext" argument must be a string');
    v(e);
    var t = 0, i = -1, a = true, n;
    if (r !== undefined && r.length > 0 && r.length <= e.length) {
      if (r.length === e.length && r === e)
        return "";
      var l = r.length - 1, f = -1;
      for (n = e.length - 1;n >= 0; --n) {
        var c = e.charCodeAt(n);
        if (c === 47) {
          if (!a) {
            t = n + 1;
            break;
          }
        } else
          f === -1 && (a = false, f = n + 1), l >= 0 && (c === r.charCodeAt(l) ? --l === -1 && (i = n) : (l = -1, i = f));
      }
      return t === i ? i = f : i === -1 && (i = e.length), e.slice(t, i);
    } else {
      for (n = e.length - 1;n >= 0; --n)
        if (e.charCodeAt(n) === 47) {
          if (!a) {
            t = n + 1;
            break;
          }
        } else
          i === -1 && (a = false, i = n + 1);
      return i === -1 ? "" : e.slice(t, i);
    }
  }, extname: function(e) {
    v(e);
    for (var r = -1, t = 0, i = -1, a = true, n = 0, l = e.length - 1;l >= 0; --l) {
      var f = e.charCodeAt(l);
      if (f === 47) {
        if (!a) {
          t = l + 1;
          break;
        }
        continue;
      }
      i === -1 && (a = false, i = l + 1), f === 46 ? r === -1 ? r = l : n !== 1 && (n = 1) : r !== -1 && (n = -1);
    }
    return r === -1 || i === -1 || n === 0 || n === 1 && r === i - 1 && r === t + 1 ? "" : e.slice(r, i);
  }, format: function(e) {
    if (e === null || typeof e != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
    return F("/", e);
  }, parse: function(e) {
    v(e);
    var r = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return r;
    var t = e.charCodeAt(0), i = t === 47, a;
    i ? (r.root = "/", a = 1) : a = 0;
    for (var n = -1, l = 0, f = -1, c = true, d = e.length - 1, o = 0;d >= a; --d) {
      if (t = e.charCodeAt(d), t === 47) {
        if (!c) {
          l = d + 1;
          break;
        }
        continue;
      }
      f === -1 && (c = false, f = d + 1), t === 46 ? n === -1 ? n = d : o !== 1 && (o = 1) : n !== -1 && (o = -1);
    }
    return n === -1 || f === -1 || o === 0 || o === 1 && n === f - 1 && n === l + 1 ? f !== -1 && (l === 0 && i ? r.base = r.name = e.slice(1, f) : r.base = r.name = e.slice(l, f)) : (l === 0 && i ? (r.name = e.slice(1, n), r.base = e.slice(1, f)) : (r.name = e.slice(l, n), r.base = e.slice(l, f)), r.ext = e.slice(n, f)), l > 0 ? r.dir = e.slice(0, l - 1) : i && (r.dir = "/"), r;
  }, sep: "/", delimiter: ":", win32: null, posix: null };
  m.posix = m;
  w.exports = m;
});
var x = j(k());
var u = x;
var J = x;
var P = function(s) {
  return s;
};
var S = function() {
  throw new Error("Not implemented");
};
u.parse ??= S;
J.parse ??= S;
var g = { resolve: u.resolve.bind(u), normalize: u.normalize.bind(u), isAbsolute: u.isAbsolute.bind(u), join: u.join.bind(u), relative: u.relative.bind(u), toNamespacedPath: P, dirname: u.dirname.bind(u), basename: u.basename.bind(u), extname: u.extname.bind(u), format: u.format.bind(u), parse: u.parse.bind(u), sep: "/", delimiter: ":", win32: undefined, posix: undefined, _makeLong: P };
var y = { sep: "\\", delimiter: ";", win32: undefined, ...g, posix: g };
g.win32 = y.win32 = y;
g.posix = g;

// src/util/input.ts
var inputToIntcodeComputerMemory = (input) => input.split(",").map(toInt);
var toInt = (input) => {
  const num = parseInt(input, 10);
  if (isNaN(num)) {
    throw new Error(`${input} cannot be parsed with parseInt()`);
  }
  return num;
};

// src/intcode/readFromMemory.ts
function readFromMemory(memory, address) {
  if (address < 0) {
    throw new Error("Cannot access memory at negative address");
  }
  return memory[address] ?? 0;
}

// src/intcode/parameter.ts
var parseParameterMode = (value) => {
  switch (value) {
    case 0:
      return "position";
    case 1:
      return "immediate";
    case 2:
      return "relative";
    default:
      throw new Error(`Unknown parameter mode ${value}`);
  }
};
var generateParameters = (pointer, memory, parameterModes, parameterCount) => {
  if (pointer + parameterCount >= memory.length) {
    throw new Error("Cannot create parameter, out of memory");
  }
  const parameters = memory.slice(pointer + 1, pointer + 1 + parameterCount).map((value, index) => ({
    value,
    mode: parameterModes[index] ?? "position"
  }));
  if (parameters.length !== parameterCount) {
    throw new Error("Invalid parameter count");
  }
  return parameters;
};
var getParameterValue = (parameter, relativeBase) => {
  switch (parameter.mode) {
    case "position":
    case "immediate":
      return parameter.value;
    case "relative":
      return parameter.value + relativeBase;
  }
};
var getParameterValueFromMemory = (parameter, memory, relativeBase) => {
  switch (parameter.mode) {
    case "position":
      return readFromMemory(memory, parameter.value);
    case "immediate":
      return parameter.value;
    case "relative":
      return readFromMemory(memory, parameter.value + relativeBase);
  }
};

// src/intcode/instruction.ts
var parseInstruction = (pointer, memory) => {
  const opcodeValue = readFromMemory(memory, pointer);
  const opcodeDigits = opcodeValue.toString().split("").map(toInt);
  const opcode = opcodeDigits.length > 1 ? toInt(`${opcodeDigits[opcodeDigits.length - 2]}${opcodeDigits[opcodeDigits.length - 1]}`) : opcodeDigits[0];
  const parameterModes = opcodeDigits.length > 2 ? opcodeDigits.slice(0, -2).reverse().map(parseParameterMode) : [];
  switch (opcode) {
    case 1:
      return parseAddInstruction(pointer, parameterModes, memory);
    case 2:
      return parseMultiplyInstruction(pointer, parameterModes, memory);
    case 3:
      return parseInputInstruction(pointer, parameterModes, memory);
    case 4:
      return parseOutputInstruction(pointer, parameterModes, memory);
    case 5:
      return parseJumpIfTrueInstruction(pointer, parameterModes, memory);
    case 6:
      return parseJumpIfFalseInstruction(pointer, parameterModes, memory);
    case 7:
      return parseLessThanInstruction(pointer, parameterModes, memory);
    case 8:
      return parseEqualsInstruction(pointer, parameterModes, memory);
    case 9:
      return parseAdjustRelativeBaseInstruction(pointer, parameterModes, memory);
    default:
      throw new Error(`Unknown opcode ${opcode}`);
  }
};
var parseInstructionWithParameters = (type, pointer, parameterModes, memory, parameterCount) => ({
  type,
  parameters: generateParameters(pointer, memory, parameterModes, parameterCount)
});
var parseAddInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("add", pointer, parameterModes, memory, 3);
var parseMultiplyInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("multiply", pointer, parameterModes, memory, 3);
var parseInputInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("input", pointer, parameterModes, memory, 1);
var parseOutputInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("output", pointer, parameterModes, memory, 1);
var parseJumpIfTrueInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("jump-if-true", pointer, parameterModes, memory, 2);
var parseJumpIfFalseInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("jump-if-false", pointer, parameterModes, memory, 2);
var parseLessThanInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("less-than", pointer, parameterModes, memory, 3);
var parseEqualsInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("equals", pointer, parameterModes, memory, 3);
var parseAdjustRelativeBaseInstruction = (pointer, parameterModes, memory) => parseInstructionWithParameters("adjust-relative-base", pointer, parameterModes, memory, 1);
function getInstructionResult(instruction, memory, relativeBase) {
  const { type, parameters } = instruction;
  switch (type) {
    case "add":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase) + getParameterValueFromMemory(parameters[1], memory, relativeBase)
      };
    case "multiply":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase) * getParameterValueFromMemory(parameters[1], memory, relativeBase)
      };
    case "output":
      return {
        type: "set-output",
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase)
      };
    case "jump-if-true":
      return getParameterValueFromMemory(parameters[0], memory, relativeBase) !== 0 ? {
        type: "set-pointer",
        value: getParameterValueFromMemory(parameters[1], memory, relativeBase)
      } : { type: "nothing" };
    case "jump-if-false":
      return getParameterValueFromMemory(parameters[0], memory, relativeBase) === 0 ? {
        type: "set-pointer",
        value: getParameterValueFromMemory(parameters[1], memory, relativeBase)
      } : { type: "nothing" };
    case "less-than":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase) < getParameterValueFromMemory(parameters[1], memory, relativeBase) ? 1 : 0
      };
    case "equals":
      return {
        type: "update-value",
        address: getParameterValue(parameters[2], relativeBase),
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase) === getParameterValueFromMemory(parameters[1], memory, relativeBase) ? 1 : 0
      };
    case "adjust-relative-base":
      return {
        type: "update-relative-base",
        value: getParameterValueFromMemory(parameters[0], memory, relativeBase)
      };
  }
}
function getInputInstructionResult(instruction, relativeBase, input) {
  const { parameters } = instruction;
  if (typeof input === "undefined") {
    return { type: "request-input" };
  }
  return {
    type: "update-value",
    address: getParameterValue(parameters[0], relativeBase),
    value: input
  };
}

// src/intcode/IntcodeComputer.ts
class IntcodeComputer {
  memory;
  pointer = 0;
  relativeBase = 0;
  inputQueue = [];
  outputs = [];
  debug = false;
  constructor(initialMemory) {
    this.memory = [...initialMemory];
  }
  run() {
    const OPCODE_HALT = 99;
    while (readFromMemory(this.memory, this.pointer) !== OPCODE_HALT) {
      const instruction = parseInstruction(this.pointer, this.memory);
      if (instruction.type === "input") {
        this.log("Input instruction");
        this.log("Input queue contains", this.inputQueue);
        this.log(`Calling getInputInstructionResult() with input ${this.inputQueue[0]}`);
      }
      const instructionResult = instruction.type === "input" ? getInputInstructionResult(instruction, this.relativeBase, this.inputQueue.shift()) : getInstructionResult(instruction, this.memory, this.relativeBase);
      if (instruction.type === "input") {
        this.log("Input queue now contains", this.inputQueue);
      }
      this.log(instructionResult.type);
      switch (instructionResult.type) {
        case "update-value":
          this.memory[instructionResult.address] = instructionResult.value;
          this.pointer += instruction.parameters.length + 1;
          break;
        case "request-input":
          return {
            status: "input"
          };
        case "set-output":
          this.pointer += instruction.parameters.length + 1;
          this.outputs.push(instructionResult.value);
          return {
            status: "output",
            output: instructionResult.value
          };
        case "set-pointer":
          this.pointer = instructionResult.value;
          break;
        case "update-relative-base":
          this.relativeBase += instructionResult.value;
          this.pointer += instruction.parameters.length + 1;
          break;
        case "nothing":
          this.pointer += instruction.parameters.length + 1;
          break;
        default:
          return instructionResult;
      }
    }
    return {
      status: "done"
    };
  }
  enqueueInput(input) {
    this.inputQueue.push(input);
  }
  static createAndRun(initialMemory, input) {
    const computer = new IntcodeComputer(initialMemory);
    if (typeof input !== "undefined") {
      computer.enqueueInput(input);
    }
    let result = computer.run();
    while (result.status !== "done") {
      switch (result.status) {
        case "input":
          throw new Error("Computer requires more input");
        case "output":
          result = computer.run();
          break;
      }
    }
    return computer;
  }
  log(...data) {
    if (this.debug) {
      console.log(...data);
    }
  }
}

// src/25/funcs.ts
function commandToAscii(command) {
  const ASCII_NEWLINE = 10;
  const asciiCommand = command.split("").map((c) => c.charCodeAt(0));
  return [...asciiCommand, ASCII_NEWLINE];
}
function asciiToString(ascii) {
  return ascii.map((charCode) => String.fromCharCode(charCode)).join("");
}
function parseOutput(output) {
  console.log(output);
  return output.trim().split(/\s*Command\?\s*/).map((s) => s.trim()).filter((s) => s !== "").map((section) => {
    const titleDescriptionMatches = section.match(/== ([\w .,?!';\-:]+) ==\n([\w .,?!';\-:]+)/m);
    if (!titleDescriptionMatches) {
      return {
        type: section === "You cannot go there" ? "error" : "info",
        description: section
      };
    }
    const weightCheckMatches = section.match(/A loud, robotic voice says/m);
    if (weightCheckMatches) {
      return {
        type: "error",
        description: section
      };
    }
    const doorsMatches = section.match(/^Doors here lead:((?:\n- [\w .,?!';\-]+)+)/m);
    const itemsMatches = section.match(/^Items here:((?:\n- [\w .,?!';\-:]+)+)/m);
    return {
      type: "room",
      title: titleDescriptionMatches[1],
      description: titleDescriptionMatches[2],
      doors: doorsMatches?.[1]?.split(`
- `).filter((s) => s !== "") ?? [],
      items: itemsMatches?.[1]?.split(`
- `).filter((s) => s !== "") ?? []
    };
  });
}
function parseInventory(inventory) {
  return inventory.trim().split(`
`).map((s) => s.trim()).filter((s) => s !== "" && s !== "Command?" && s !== "Items in your inventory:" && s !== "You aren't carrying any items.").map((s) => {
    return s.replace("- ", "");
  });
}
async function run(initialMemory, {
  onInput
}) {
  const computer = new IntcodeComputer(initialMemory);
  let computerStatus = computer.run();
  let output = [];
  while (computerStatus.status !== "done") {
    switch (computerStatus.status) {
      case "output":
        output.push(computerStatus.output);
        computerStatus = computer.run();
        break;
      case "input":
        const invOutput = [];
        const invCommandAscii = commandToAscii("inv");
        invCommandAscii.forEach((char) => computer.enqueueInput(char));
        computerStatus = computer.run();
        while (computerStatus.status === "output") {
          invOutput.push(computerStatus.output);
          computerStatus = computer.run();
        }
        const nextCommand = await onInput(parseOutput(asciiToString(output)), parseInventory(asciiToString(invOutput)));
        const nextCommandAscii = commandToAscii(nextCommand);
        nextCommandAscii.forEach((char) => computer.enqueueInput(char));
        computerStatus = computer.run();
        break;
    }
  }
  throw new Error(`Done! ${asciiToString(output)}`);
}

// src/25/part1.ts
var outputContainer = document.getElementById("output");
var inventoryContainer = document.getElementById("items");
var programInput = document.getElementById("program");
var runButton = document.getElementById("run");
var dangerousItems = [
  "escape pod",
  "giant electromagnet",
  "infinite loop",
  "molten lava",
  "photons"
];
runButton.addEventListener("click", async () => {
  const initialMemory = inputToIntcodeComputerMemory(programInput.value);
  const roomMap = {};
  let prevRoom = undefined;
  let prevRoomTitle = undefined;
  let prevDirection = undefined;
  function roomContainsUnexploredRooms(checkedRooms, linkedRoom) {
    if (!roomMap[linkedRoom]) {
      return true;
    }
    const linkedRoomsWithoutCurrentRoom = Object.values(roomMap[linkedRoom]).filter((room) => room === undefined || !checkedRooms.includes(room));
    if (linkedRoomsWithoutCurrentRoom.length === 0) {
      return false;
    }
    return linkedRoomsWithoutCurrentRoom.some((room) => room === undefined ? true : roomContainsUnexploredRooms([linkedRoom, ...checkedRooms], room));
  }
  await run(initialMemory, {
    onInput: async (outputs, inventory) => {
      outputContainer.textContent = "";
      const lastRoomIndex = outputs.findLastIndex((output) => output.type === "room");
      const lastOutput = outputs[lastRoomIndex];
      let currentRoom = undefined;
      if (lastOutput?.type === "room") {
        currentRoom = {};
        lastOutput.doors.forEach((dir) => {
          currentRoom[dir] = undefined;
        });
      }
      if (prevRoom && prevRoomTitle && prevDirection && lastOutput.type === "room" && currentRoom && prevRoomTitle !== lastOutput.title) {
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
            textContent: output.description
          });
          sectionEl.appendChild(descriptionEl);
          if (isLastRoom) {
            const doorsContainerEl = createElement("div", {
              className: "output-list output-doors"
            }, [
              createElement("h3", { textContent: "Doors" }),
              createElement("ul", {}, output.doors.map((door) => {
                const linkedRoomName = roomMap[output.title]?.[door];
                const linkedRoomIsUnexplored = linkedRoomName ? roomContainsUnexploredRooms([output.title], linkedRoomName) : true;
                const id = `${output.title}-${door}`;
                return createElement("li", {}, [
                  createElement("button", {
                    textContent: `${door} (${linkedRoomName ? `${linkedRoomName} - ${linkedRoomIsUnexplored ? "contains unvisited rooms" : "fully explored"}` : "unexplored"})`,
                    disabled: !isLastRoom,
                    "data-id": id,
                    "data-direction": door
                  })
                ]);
              }))
            ]);
            sectionEl.appendChild(doorsContainerEl);
          }
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
              itemButton.disabled = isDangerous || !isLastRoom || inventory.includes(item);
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
        outputContainer.querySelectorAll(".output-doors button").forEach((el) => {
          el.addEventListener("click", () => {
            const dir = el.getAttribute("data-direction");
            if (lastOutput?.type === "room") {
              prevRoom = currentRoom;
              prevRoomTitle = lastOutput.title;
              prevDirection = dir;
            }
            resolve(dir);
          });
        });
        outputContainer.querySelectorAll(".output-items button").forEach((el) => {
          el.addEventListener("click", () => {
            resolve(`take ${el.textContent}`);
          });
        });
        inventoryContainer.querySelectorAll("button").forEach((el) => {
          el.addEventListener("click", () => {
            resolve(`drop ${el.getAttribute("data-item")}`);
          });
        });
      });
    }
  });
});
function getOppositeDirection(dir) {
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
function createElement(tagName, props = {}, children = []) {
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

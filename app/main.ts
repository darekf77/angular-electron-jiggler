import { app, BrowserWindow, screen, ipcRenderer, ipcMain, Screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {
  mouse,
  singleWord,
  sleep,
  useConsoleLogger,
  ConsoleLogLevel,
  straightTo,
  centerOf,
  Button,
  getActiveWindow,
  Point,
} from "@nut-tree/nut-js";


let jigger = false;

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const wait = (milisecond = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, milisecond)
  });
}

async function jiggerStartFn() {
  // Speed up the mouse.
  let size: Electron.Size = undefined as any;

  let twoPI: number = undefined as any;
  let height: number = undefined as any;
  let width: number = undefined as any;

  const calculate = () => {
    size = screen.getPrimaryDisplay().size;
    const scale = screen.getPrimaryDisplay().scaleFactor;
    twoPI = Math.PI * 2.0;
    height = ( Math.floor( size.height * scale) / 2) - 10;
    width = Math.floor(size.width * scale);
  }
  while (true) {
    calculate();
    for (var x = 0; x < width; x++) {
      const y = height * Math.sin((twoPI * x) / width) + height;
      // robot.moveMouse(x, y);
      if (jigger) {
        mouse.move([new Point(x, y)]);
        await wait(1);
      } else {
        await wait(1000);
        calculate();
      }
    }
  }

}

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }



  // let jig = false;
  // ipcRenderer.on('jiggle', (event) => {
  //   // ipcRenderer.sco
  //   console.log('hellasdo!')

  // });
  // console.log('KURWA')
  // ipcMain.on('jiggle', (event) => {
  //   event.returnValue = 'pizda';
  //   console.log('helloasasdd!')

  // });

  // ipcMain.handle('jiggle', async (event, someArgument) => {
  //   // const result = await doSomeWork(someArgument)
  //   return 'eleoel'
  // })


  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });


  ipcMain.on('set-title', (event, title) => {
    jigger = !jigger;
    // const webContents = event.sender
    // const win = BrowserWindow.fromWebContents(webContents)
    // win!.setTitle(title)
    // mouse.move([new Point(500, 500)]);
    // jiggerStartFn();
    event.returnValue = 'pizda';

  });
  jiggerStartFn();
  // win.webContents.openDevTools();



  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });


} catch (e) {
  // Catch Error
  // throw e;
}

import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import PCSC, { KEYS, Card, Reader } from '@tockawa/nfc-pcsc';

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

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
      allowRunningInsecureContent: serve,
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

  // This function handles the authentication process for a specific block on the card and writes the specified data to it.
  async function authenticateAndWrite(
    reader: Reader,
    block: number,
    data: string
  ) {
    try {
      // Authenticate the block using the type A key and a predefined key value.
      await reader.authenticate(block, KEY_TYPE_A, 'FFFFFFFFFFFF');

      // Prepare the data to be written. We're using a 16-byte buffer and filling it with our data.
      const bufferData = Buffer.allocUnsafe(16);
      bufferData.fill(0); // Initialize the buffer with zeros.
      bufferData.write(data); // Write our data string to the buffer.

      // Write the buffer data to the specified block on the card.
      await reader.write(block, bufferData, 16);
    } catch (error) {
      console.log(`Error writing to block ${block}`, error);
      throw error; // Rethrow the error so that it can be caught and handled by an outer scope, if necessary.
    }
  }

  if (win) {
  }
  const { KEY_TYPE_A } = KEYS;

  const nfc = new PCSC();

  (async () => {
    nfc.on('reader', async (reader: Reader) => {
      reader.on('card', async (card: Card) => {
        console.log('Card detected', card);
        try {
          async function readBlock(block: number): Promise<string> {
            await reader.authenticate(block, KEY_TYPE_A, 'FFFFFFFFFFFF');
            const data = await reader.read(block, 9);
            return data.toString('utf8');
          }
          async function fetchData(): Promise<string> {
            return await readBlock(4);
          }
          const payload = await fetchData();
          console.log(payload);
          if (win) {
            win.webContents.send('nfc:read', {
              status: 'success',
              message: 'Card read successfully',
              card: card,
              payload: payload,
            });
          }

          ipcMain.on('nfc:write', async (event, payload) => {
            try {
              await authenticateAndWrite(reader, 4, payload);
              if (win) {
                win.webContents.send('nfc:write', {
                  status: 'success',
                  message: 'Card written successfully',
                  card,
                  payload,
                });
              }
            } catch (error) {
              console.error('Authentication error', error);
              if (win) {
                win.webContents.send('nfc:write', {
                  status: 'error',
                  message: error,
                  card,
                  payload,
                });
              }
            }
          });
        } catch (error) {
          console.error('Authentication error', error);
          if (win) {
            win.webContents.send('nfc:read', {
              status: 'error',
              message: error,
              card,
            });
          }
        }
      });
      // Set up an event listener for handling errors related to the reader.
      reader.on('error', (err) => {
        console.log('Reader Error', err);
        if (win) {
          win.webContents.send('nfc:read', {
            status: 'error',
            message: err,
          });
        }
      });
    });

    // Set up a global event listener for any other NFC-related errors.
    nfc.on('error', (err) => {
      console.log('NFC Error', err);
      if (win) {
        win.webContents.send('nfc:error', err);
      }
    });
  })();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

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

class LeekWarsBot {
  constructor(login, password) {
    this.login = login;
    this.password = password;
    this.stopFlag = false;
  }

  async generateConfig() {
    try {
      const response = await fetch('https://leekwars.com/api/farmer/login', {
        method: 'POST',
        body: JSON.stringify({
          login: this.login,
          password: this.password,
          keep_connected: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const token = response.headers.get('Set-Cookie').split(';')[0];
        const farmer = data.farmer;

        if (!token) {
          throw new Error('Unable to log in.');
        }
        console.log('[+] Token retrieved.');
        return { farmer, token };
      } else {
        throw new Error('Connection error: ' + response.statusText);
      }
    } catch (error) {
      throw new Error('Connection error: ' + error.message);
    }
  }

  async fight(leekId, token) {
    try {
      const gardenResponse = await fetch('https://leekwars.com/api/garden/get', {
        headers: {
          Cookie: token
        }
      });

      if (gardenResponse.ok) {
        const gardenData = await gardenResponse.json();
        const garden = gardenData.garden;

        if (garden.fights === 0) {
          throw new Error('You have no available fights with this leek!');
        }

        console.log('You have ' + garden.max_fights + ' available fights!');

        while (garden.fights > 0 && !this.stopFlag) {
          const opponentsResponse = await fetch('https://leekwars.com/api/garden/get-leek-opponents/' + leekId, {
            headers: {
              Cookie: token
            }
          });

          if (opponentsResponse.ok) {
            const opponentsData = await opponentsResponse.json();
            const opponents = opponentsData.opponents;

            if (!opponents) {
              break;
            }

            const opponent = opponents[0];

            await new Promise(resolve => setTimeout(resolve, 500)); // Delay between fights

            console.log('Fighting against ' + opponent.name + ' leek! (id: ' + opponent.id + ')');

            const fightData = new URLSearchParams();
            fightData.append('leek_id', leekId);
            fightData.append('target_id', opponent.id);

            const fightResponse = await fetch('https://leekwars.com/api/garden/start-solo-fight', {
              method: 'POST',
              body: fightData,
              headers: {
                Cookie: token
              }
            });

            if (fightResponse.ok) {
              const fightData = await fightResponse.json();
              console.log(JSON.stringify(fightData));
              garden.fights--;
            } else {
              throw new Error('Request error: ' + fightResponse.statusText);
            }
          } else {
            throw new Error('Request error: ' + opponentsResponse.statusText);
          }
        }
      } else {
        throw new Error('Request error: ' + gardenResponse.statusText);
      }
    } catch (error) {
      throw new Error('Request error: ' + error.message);
    }
  }

  async runFights() {
    try {
      const { farmer, token } = await this.generateConfig();
      console.log('Hello ' + farmer.name + '!');
      const leeks = Object.entries(farmer.leeks);

      for (const [leekId, leekInfo] of leeks) {
        console.log('Processing leek ' + leekInfo.name);

        await this.fight(leekId, token);

        if (this.stopFlag) {
          break;
        }
      }
    } catch (error) {
      console.log('An error occurred: ' + error.message);
    }
  }

  stopProgram() {
    this.stopFlag = true;
  }

  async startProgram() {
    this.stopFlag = false;

    const startButton = document.getElementById('startButton');
    startButton.disabled = true;

    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    this.login = login;
    this.password = password;

    await this.runFights();

    startButton.disabled = false;
  }
}

// Example usage
const bot = new LeekWarsBot('', '');

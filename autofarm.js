class LeekWarsBot {
  constructor(login, password) {
    this.login = login;
    this.password = password;
    this.stopFlag = false;
  }

  async generateConfig() {
    try {
      const payload = {
        login: this.login,
        password: this.password,
        keep_connected: 'true',
      };
      const response = await fetch('https://leekwars.com/api/farmer/login', {
        method: 'POST',
        body: new URLSearchParams(payload),
      });
      if (!response.ok) {
        throw new Error(`[-] Unable to log in. Status: ${response.status}`);
      }
      const data = await response.json();
      const token = response.headers.get('set-cookie').split(';')[0].split('=')[1];
      const phpsessid = response.headers.get('set-cookie').split(';')[1].split('=')[1];
      const farmer = data.farmer;
      console.log('[+] Token and cookies retrieved.');
      return { farmer, token, phpsessid };
    } catch (e) {
      this.handleError(`Connection error: ${e.message}`);
    }
  }

  async fight(leekId, cookies) {
    try {
      const gardenResponse = await fetch('https://leekwars.com/api/garden/get', { headers: { Cookie: cookies } });
      if (!gardenResponse.ok) {
        throw new Error(`Failed to fetch garden data. Status: ${gardenResponse.status}`);
      }
      const garden = await gardenResponse.json();
      if (garden.garden.fights === 0) {
        this.handleError('You have no available fights with this leek!');
        return;
      }
      console.log(`You have ${garden.garden.max_fights} available fights!`);

      while (garden.garden.fights > 0 && !this.stopFlag) {
        const opponentsResponse = await fetch(`https://leekwars.com/api/garden/get-leek-opponents/${leekId}`, {
          headers: { Cookie: cookies },
        });
        if (!opponentsResponse.ok) {
          throw new Error(`Failed to fetch opponents. Status: ${opponentsResponse.status}`);
        }
        const opponents = await opponentsResponse.json();
        if (!opponents.opponents.length) {
          break;
        }
        const opponent = opponents.opponents[0];

        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Fighting against ${opponent.name} leek! (id: ${opponent.id})`);
        const fightData = { leek_id: leekId, target_id: opponent.id };
        const fightResponse = await fetch('https://leekwars.com/api/garden/start-solo-fight', {
          method: 'POST',
          body: new URLSearchParams(fightData),
          headers: { Cookie: cookies },
        });
        if (!fightResponse.ok) {
          throw new Error(`Failed to start fight. Status: ${fightResponse.status}`);
        }
        const fightResult = await fightResponse.json();
        console.log(JSON.stringify(fightResult));
        garden.garden.fights--;
      }
    } catch (e) {
      this.handleError(`Request error: ${e.message}`);
    }
  }

  async runFights() {
    try {
      const { farmer, token, phpsessid } = await this.generateConfig();
      console.log(`Hello ${farmer.name}!`);
      const cookies = `token=${token}; PHPSESSID=${phpsessid}`;

      for (const leekId in farmer.leeks) {
        console.log(`Processing leek ${farmer.leeks[leekId].name}\n`);
        await this.fight(leekId, cookies);
        if (this.stopFlag) {
          break;
        }
      }
    } catch (e) {
      this.handleError(e.message);
    }
  }

  stopProgram() {
    this.stopFlag = true;
  }

  async startProgram(login, password) {
    this.stopFlag = false;
    this.login = login;
    this.password = password;
    if (!this.login || !this.password) {
      this.handleError('Please provide a login and password.');
      return;
    }
    await this.runFights();
  }

  run() {
    // Example usage
    const bot = new LeekWarsBot('', '');

    if (!bot.useGui) {
      bot.login = 'Dyslate';
      bot.password = '280696';
    }

    bot.run();
  }

  handleError(error_message) {
    console.error(`An error occurred: ${error_message}`);
  }
}

// Example usage
const bot = new LeekWarsBot('', '');
bot.run();

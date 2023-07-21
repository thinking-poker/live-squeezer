import { displayAmount, fixValue } from '../units/vikFunctions';

class Action {

    constructor(input, history) {

        this.input = input.trim().toLowerCase();
        this.history = history;
        this.player = history.players[0];

        this.isValid = this.validate();

        if (this.isValid) {

            this.process();
            this.setHistoryAction();
            this.setHistoryPlayer();
        }
    }

    validate() {

        if (this.input.endsWith('s')) {
            this.input = this.input.slice(0, -1);
        }

        const isValid = ['fold', 'call', 'check'].includes(this.input);

        if (isValid) return true;

        const value = +this.input;
        return !isNaN(value) && value !== 0;
    }

    get getIsValid() {
        return this.isValid;
    }


    process() {

        const action = this[this.input + 's'];

        if (action) action.call(this);
        else this.betsOrRaises();
    }

    subtitle(action) {
        const { history, player } = this;
        let name = player.isHero ? 'Hero' : player.name
        history.subtitle = `${name} (${player.position}): ${action}`
    }

    folds() {

        const { history, player } = this;

        player.acted = true;
        player.stillPlaying = false;

        history.log = `${player.name}: folds`;
        this.subtitle('folds')
    }

    calls() {

        const { history, player } = this;

        player.acted = true;

        let call = history.currentBet - player.moneyOnStreet;
        player.currentStack -= call;
        player.currentStack = fixValue(player.currentStack);

        if (player.currentStack <= 0) {

            player.moneyOnStreet += player.currentStack + call;
            player.moneyOnStreet = fixValue(player.moneyOnStreet);

            call = player.currentStack + call;
            player.currentStack = 0;
            player.isAllIn = true;
            player.stillPlaying = false;
        }
        else player.moneyOnStreet = history.currentBet;

        const amount = displayAmount(call);
        const allin = player.isAllIn ? ' and is all-in' : '';

        history.log = `${player.name}: calls ${amount}${allin}`;

        this.subtitle(`calls ${amount}${allin}`)

        if (fixValue(call) === 0) history.log = `${player.name}: checks`;
        this.subtitle('checks')
    }

    checks() {

        const { history, player } = this;

        player.acted = true;
        history.log = `${player.name}: checks`;
        this.subtitle('checks')
    }


    betsOrRaises() {

        const { history, player, input } = this;

        history.players.forEach(p => {
            if (p.stillPlaying) p.acted = false;
        });

        player.acted = true;

        if (history.currentBet >= player.currentStack + player.moneyOnStreet) {
            this.calls();
            return;
        }

        if (history.players.filter(p => p.stillPlaying).length < 2) {
            this.calls();
            return;
        }

        let betRaiseValue = fixValue(Number(input));

        if (betRaiseValue <= history.currentBet) {
            this.calls();
            return;
        }

        const maxMoneyOnStreet = fixValue(player.currentStack + player.moneyOnStreet);

        if (betRaiseValue >= maxMoneyOnStreet) {
            betRaiseValue = maxMoneyOnStreet;
        }

        const raisesAmount = displayAmount(betRaiseValue - history.currentBet);
        const betRaiseAmount = displayAmount(betRaiseValue);

        let log = history.currentBet === 0
            ? `bets ${betRaiseAmount}`
            : `raises ${raisesAmount} to ${betRaiseAmount}`;

        history.log = `${player.name}: ${log}`
        this.subtitle(log);

        history.currentBet = betRaiseValue;
        player.currentStack -= betRaiseValue - player.moneyOnStreet;
        player.currentStack = fixValue(player.currentStack);
        player.moneyOnStreet = betRaiseValue;

        if (player.currentStack === 0) {
            player.isAllIn = true;
            player.stillPlaying = false;
            history.log += ' and is all-in';
            history.subtitle += ' and is all-in'
        }

    }

    setHistoryAction() {

        const { history, player } = this;

        const olds = new RegExp(`${player.name + ': '}|${'\r\n'}`, 'g');

        history.action = history.log.replace(olds, '').split(' ')[0];
    }

    setHistoryPlayer() {

        const { history, player } = this;

        history.player = player;
    }

}

export default Action;
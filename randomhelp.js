class RandomHelp {
    static random(min, max) {
        let dif = max - min + 1;
        return Math.floor(Math.random() * dif) + min;
    };
};
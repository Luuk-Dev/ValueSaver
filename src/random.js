module.exports = (max, min = 0) => {
    return Math.round(Math.random() * Number(max)) + min;
}

export const getFoodPosition = (fieldSize, excludes) => {
    while (true) {
        const x = Math.floor(Math.random() * ((fieldSize - 1) - 1)) + 1;
        const y = Math.floor(Math.random() * ((fieldSize - 1) - 1)) + 1;
        const isConflict = excludes.some(item => item.x === x && item.y === y)

        if (!isConflict) {
            return { x, y }
        }
    }
}

export const initField = (fieldSize, snakePostion) => {
    const fields = []

    for (let i = 0; i < fieldSize; i++) {
        const cols = new Array(fieldSize).fill('')
        fields.push(cols)
    }

    // fields[17][17] = 'snake';
    // fields[initialPostion.x][initialPostion.y] = 'snake';
    fields[snakePostion.x][snakePostion.y] = 'snake';

    const food = getFoodPosition(fieldSize, [snakePostion])
    fields[food.y][food.x] = 'food'

    return fields
}






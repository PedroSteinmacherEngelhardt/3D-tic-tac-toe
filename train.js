let currentModel;

const constructModel = () => {
    currentModel && currentModel.dispose();
    tf.disposeVariables();

    const model = tf.sequential();

    model.add(
        tf.layers.dense({
            inputShape: 64,
            units: 64,
            activation: "relu"
        })
    );

    model.add(
        tf.layers.dense({
            units: 64,
            activation: "relu"
        })
    );

    model.add(
        tf.layers.dense({
            units: 64,
            activation: "softmax"
        })
    );

    const learningRate = 0.005;
    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
    });

    currentModel = model;
    return model;
};

const getModel = () => {
    if (currentModel) {
        return currentModel;
    } else {
        return constructModel();
    }
};

const trainModel = async (model, stackedX, stackedY) => {
    const allCallbacks = { onEpochEnd: (epoch, log) => console.log(epoch, log) };

    await model.fit(stackedX, stackedY, {
        epochs: 100,
        shuffle: true,
        batchSize: 32,
        callbacks: allCallbacks
    });

    return model;
};

const doAnMove = async (board) => {
    const model = getModel()
    const result = await model.predict(tf.tensor2d([board]));
    const value = await result.data()

    let sortedBoard = value.sort((a, b) => b - a);

    let arr = sortedBoard.map((_, i) => {
        if (board[i] == 0)
            return i
    })

    let largestThree = arr.slice(0, 3);
    largestThree = largestThree.map((i) => value[i])

    let finalArr = value.map((e, i) => {
        if (largestThree.includes(e) && arr.includes(i)) {
            return i
        }
    })

    let randomValue = finalArr[Math.floor(Math.random() * finalArr.length)];

    console.log(randomValue)
}

const mockGame = async () => {
    let gameBoard = Array(64).fill(0)

    doAnMove(gameBoard)

}


const fitDaModel = async () => {
    const model = constructModel();

    const stackedX = tf.tensor2d([
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, -1, 0, 0, 0, 0],
        [1, 1, 0, 1, -1, 0, -1, 0, 0]
    ]);

    const stackedY = tf.tensor2d([
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0]
    ]);

    await trainModel(model, stackedX, stackedY);

    const result = await model.predict(tf.tensor2d([[1, 0, 0, 0, 0, 0, 0, 0, 0]]));
    console.log((await result.data()));
};


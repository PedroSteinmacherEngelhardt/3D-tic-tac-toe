let currentModel;

const constructModel = () => {
    currentModel && currentModel.dispose();
    tf.disposeVariables();

    const model = tf.sequential();

    model.add(
        tf.layers.dense({
            inputShape: 9,
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
            units: 9,
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

    console.log("Model Trained");

    return model;
};


const fitDaModel = async () => {
    const model = constructModel();

    // const stackedX = tf.tensor2d([
    //     [1, 0, 0, 0, 0, 0, 0, 0, 0],
    //     [1, 0, 0, 1, -1, 0, 0, 0, 0],
    //     [1, 1, 0, 1, -1, 0, -1, 0, 0]
    // ]);

    // const stackedY = tf.tensor2d([
    //     [0, 0, 0, 0, 1, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 1, 0, 0],
    //     [0, 0, 1, 0, 0, 0, 0, 0, 0]
    // ]);

    // await trainModel(model, stackedX, stackedY);

    const result = await model.predict(tf.tensor2d([[1, 0, 0, 0, 0, 0, 0, 0, 0]]));
    console.log(await result.data());
};


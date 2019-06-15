import { Visualiser } from './Visualiser'

var tf = require('@tensorflow/tfjs')
console.log(tf.getBackend())

export class Playground {
  private context2D: CanvasRenderingContext2D
  private visualiser: Visualiser = new Visualiser(document.querySelector('#chartContainer'))
  constructor() {
    this.setupListeners()
  }
  setupListeners() {
    document.querySelector('#modal').addEventListener('click', () => {
      this.modal()
    })
    document.querySelector('#seq_modal').addEventListener('click', () => {
      this.seq_modal()
    })
    document.querySelector('#tf_flatten').addEventListener('click', () => {
      this.tf_flatten()
    })
    document.querySelector('#tf_model2').addEventListener('click', () => {
      this.tf_model2()
    })
    document.querySelector('#sigmoid').addEventListener('click', () => {
      this.visualiser.visualiseSigmoid()
    })
  }
  seq_modal() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 3, inputShape: [10] }),
        tf.layers.dense({ units: 2 }),
        tf.layers.dense({ units: 3 })
      ]
    })
    model.predict(tf.ones([8, 10]), { batchSize: 4 }).print()
  }
  tf_flatten = () => {
    const input = tf.input({ shape: [4, 3] })
    const flattenLayer = tf.layers.flatten()
    // Inspect the inferred output shape of the flatten layer, which
    // equals `[null, 12]`. The 2nd dimension is 4 * 3, i.e., the result of the
    // flattening. (The 1st dimension is the undermined batch size.)
    console.log(JSON.stringify(flattenLayer.apply(input).shape()))
    //  console.log(JSON.stringify(flattenLayer.apply(input)))
  }

  modal() {
    // Defines a simple logistic regression model with 32 dimensional input
    // and 3 dimensional output.
    const x = tf.input({ shape: [32] })
    const y = tf.layers.dense({ units: 3, activation: 'softmax' }).apply(x)
    const model = tf.model({ inputs: x, outputs: y })

    // tf.ones([2, 32]).print();
    model.predict(tf.ones([2, 32])).print()
  }

  tf_model2() {
    // Define input, which has a size of 5 (not including batch dimension).
    const input = tf.input({ shape: [5] })

    // First dense layer uses relu activation.
    const denseLayer1 = tf.layers.dense({ units: 10, activation: 'relu' })
    // Second dense layer uses softmax activation.
    const denseLayer2 = tf.layers.dense({ units: 4, activation: 'softmax' })

    // Obtain the output symbolic tensor by applying the layers on the input.
    const output = denseLayer2.apply(denseLayer1.apply(input))

    // Create the model based on the inputs.
    const model = tf.model({ inputs: input, outputs: output })

    // The model can be used for training, evaluation and prediction.
    // For example, the following line runs prediction with the model on
    // some fake data.
    model.predict(tf.ones([2, 5])).print() // tf.ones([2, 5]).print()
  }
}

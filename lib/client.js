import testingFunction from 'react-benchmark-test-component' // eslint-disable-line import/no-unresolved
import benchmark from 'benchmark'
import lodash from 'lodash'

// Hack to make benchmark work via webpack
const Benchmark = benchmark.runInContext({_: lodash})
window.Benchmark = Benchmark

const main = async () => {
  // Render an instance in the DOM before running the benchmark to make debugging easier
  const container = document.createElement('div')
  await testingFunction(container)
  document.body.append(container)

  const bench = new Benchmark({
    defer: true,
    async: true,
    fn(deferred) {
      const container = document.createElement('div')
      testingFunction(container).then(() => deferred.resolve())
    },
    onCycle(e) {
      window.benchmarkProgress(JSON.stringify(e.target))
    },
    onComplete() {
      window.benchmarkComplete(JSON.stringify(bench))
    }
  })

  bench.run()
}

main()

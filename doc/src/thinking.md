# Thinking in Combinators

DataKnots are a Julia library for building data processing pipelines.
In DataKnots, pipelines are assembled algebraically: they either come
from a set of atomic *primitives* or are built from other pipelines
using *combinators*. In this tutorial, we show how to build pipelines
starting from smaller components and then combining them algebraically
to implement complex processing tasks.

To start working with DataKnots, we import the package:

    using DataKnots

## Constructing Pipelines

Consider a pipeline `Hello` that produces a string value, `"Hello
World"`. It is built using the `Lift` primitive, which converts a Julia
value into a pipeline component. This pipeline can then be `run()` to
produce its output.

    Hello = Lift("Hello World")
    run(Hello)
    #=>
    │ DataKnot    │
    ├─────────────┤
    │ Hello World │
    =#

The output of the pipeline is encapsulated in a `DataKnot`, which is a
container holding structured, vectorized data. We can get the
corresponding Julia value using `get()`.

    get(run(Hello)) #-> "Hello World"

Consider another pipeline created by applying `Lift` to `3:5`, a native
`UnitRange` value. When `run()`, this pipeline emits a sequence of
integers from `3` to `5`.

    run(Lift(3:5))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        3 │
    2 │        4 │
    3 │        5 │
    =#

The output of this knot can also be converted back to native Julia.

    get(run(Lift(3:5))) #-> 3:5

DataKnots track each pipeline's cardinality. Observe that the `Hello`
pipeline produces a *singular* value, while the `Lift(3:5)` pipeline is
*plural*. In the output notation for plural knots, indices are in the
first column and values are in remaining columns.

### Composition & Identity

Two pipelines can be connected sequentially using the composition
combinator (`>>`). Consider the composition `Lift(1:3) >> Hello`. Since
`Lift(1:3)` emits 3 values and `Hello` emits `"Hello World"` regardless
of its input, their composition emits 3 copies of `"Hello World"`.

    run(Lift(1:3) >> Hello)
    #=>
      │ DataKnot    │
    ──┼─────────────┤
    1 │ Hello World │
    2 │ Hello World │
    3 │ Hello World │
    =#

When pipelines that produce plural values are combined, the output is
flattened into a single sequence. The following expression calculates
`Lift(7:9)` twice and then flattens the outputs.

    run(Lift(1:2) >> Lift(7:9))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        7 │
    2 │        8 │
    3 │        9 │
    4 │        7 │
    5 │        8 │
    6 │        9 │
    =#

The *identity* with respect to pipeline composition is called `It`.
This primitive can be composed with any pipeline without changing the
pipeline's output.

    run(Hello >> It)
    #=>
    │ DataKnot    │
    ├─────────────┤
    │ Hello World │
    =#

The identity, `It`, can be used to construct pipelines which rely upon
the output from previous processing.

    Increment = It .+ 1
    run(Lift(1:3) >> Increment)
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │        3 │
    3 │        4 │
    =#

In DataKnots, pipelines are built algebraically, using pipeline
composition, identity and other combinators. This lets us define
sophisticated pipeline components and remix them in creative ways.

### Lifting Julia Functions

With DataKnots, any native Julia expression can be *lifted* to build a
`Pipeline`. Consider the Julia function `double()` that, when applied
to a `Number`, produces a `Number`:

    double(x) = 2x
    double(3) #-> 6

What we want is an analogue to `double` that, instead of operating on
numbers, operates on pipelines. Such functions are called pipeline
combinators. We can convert any Julia function to a pipeline combinator
by passing to `Lift` the function and its arguments.

    Double(X) = Lift(double, (X,))

When given an argument, the combinator `Double` can then be used to
build a pipeline that produces a doubled value.

    run(Double(21))
    #=>
    │ DataKnot │
    ├──────────┤
    │       42 │
    =#

In combinator form, `Double` can be used within pipeline composition.
To build a pipeline component that doubles its input, the `Double`
combinator could have `It` as its argument.

    run(Lift(1:3) >> Double(It))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │        4 │
    3 │        6 │
    =#

Since this use of native Julia functions as combinators is common
enough, Julia's *broadcast* syntax (using a period) is overloaded to
make translation convenient. Any native Julia function, such as
`double`, can be used as a combinator as follows:

    run(Lift(1:3) >> double.(It))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │        4 │
    3 │        6 │
    =#

Automatic lifting also applies to built-in Julia operators. For
example, the expression `It .+ 1` is a pipeline component that
increments each one of its input values.

    run(Lift(1:3) >> (It .+ 1))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │        3 │
    3 │        4 │
    =#

One can define combinators in terms of expressions.

    OneTo(N) = UnitRange.(1, Lift(N))

When a lifted function is vector-valued, the resulting combinator
builds plural pipelines.

    run(OneTo(3))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        1 │
    2 │        2 │
    3 │        3 │
    =#

In DataKnots, pipeline combinators can be constructed directly from
native Julia functions. This lets us take advantage of Julia's rich
statistical and data processing functions.

### Aggregates

Some pipeline combinators transform a plural pipeline into a singular
pipeline; we call them *aggregate* combinators. Consider the operation
of the `Count` combinator.

    run(Count(OneTo(3)))
    #=>
    │ DataKnot │
    ├──────────┤
    │        3 │
    =#

As a convenience, `Count` can also be used as a pipeline primitive.

    run(OneTo(3) >> Count)
    #=>
    │ DataKnot │
    ├──────────┤
    │        3 │
    =#

It's possible to use aggregates within a plural pipeline. In this
example, as the outer `OneTo` goes from `1` to `3`, the `Sum` aggregate
would calculate its output from `OneTo(1)`, `OneTo(2)` and `OneTo(3)`.

    run(OneTo(3) >> Sum(OneTo(It)))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        1 │
    2 │        3 │
    3 │        6 │
    =#

However, if we rewrite the pipeline to use `Sum` as a pipeline
primitive, we get a different result.

    run(OneTo(3) >> OneTo(It) >> Sum)
    #=>
    │ DataKnot │
    ├──────────┤
    │       10 │
    =#

Since pipeline composition (`>>`) is associative, adding parenthesis
around `OneTo(It) >> Sum` will not change the result.

    run(OneTo(3) >> (OneTo(It) >> Sum))
    #=>
    │ DataKnot │
    ├──────────┤
    │       10 │
    =#

Instead of using parenthesis, we need to wrap `OneTo(It) >> Sum` with
the `Each` combinator. This combinator builds a pipeline that processes
its input elementwise.

    run(OneTo(3) >> Each(OneTo(It) >> Sum))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        1 │
    2 │        3 │
    3 │        6 │
    =#

Native Julia language aggregates, such as `sum`, can be automatically
lifted. DataKnots automatically converts a plural pipeline into an
input vector required by the native aggregate.

    using Statistics
    Mean(X) = Lift(mean, (X,))
    run(Mean(OneTo(3) >> Sum(OneTo(It))))
    #=>
    │ DataKnot │
    ├──────────┤
    │  3.33333 │
    =#

To use `Mean` as a pipeline primitive, there are two steps. First, we
use `Then` to build a pipeline that aggregates from its input. Second,
we register a `Lift` to this pipeline when the combinator's name is
mentioned in a pipeline expression.

    DataKnots.Lift(::typeof(Mean)) = Then(Mean)

Once these are done, one could take an average of sums as follows:

    run(Lift(1:3) >> Sum(OneTo(It)) >> Mean)
    #=>
    │ DataKnot │
    ├──────────┤
    │  3.33333 │
    =#

In DataKnots, aggregate operations are naturally expressed as pipeline
combinators. Moreover, custom aggregates can be easily constructed as
native Julia functions and lifted into the pipeline algebra.

## Filtering & Slicing Data

DataKnots comes with combinators for rearranging data. Consider
`Filter`, which takes one parameter, a predicate pipeline that for each
input value decides if that value should be included in the output.

    run(OneTo(6) >> Filter(It .> 3))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        4 │
    2 │        5 │
    3 │        6 │
    =#

Contrast this with the built-in Julia function `filter()`.

    filter(x -> x > 3, 1:6) #-> [4, 5, 6]

Where `filter()` returns a filtered dataset, the `Filter` combinator
returns a pipeline component, which could then be composed with any
data generating pipeline.

    KeepEven = Filter(iseven.(It))
    run(OneTo(6) >> KeepEven)
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │        4 │
    3 │        6 │
    =#

Similar to `Filter`, the `Take` and `Drop` combinators can be used to
slice an input stream: `Drop` is used to skip over input, `Take`
ignores output past a particular point.

    run(OneTo(9) >> Drop(3) >> Take(3))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        4 │
    2 │        5 │
    3 │        6 │
    =#

Since `Take` is a combinator, its argument could also be a full blown
pipeline. This next example, `FirstHalf` is a combinator that builds a
pipeline returning the first half of an input stream.

    FirstHalf(X) = Each(X >> Take(Count(X) .÷ 2))
    run(FirstHalf(OneTo(6)))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        1 │
    2 │        2 │
    3 │        3 │
    =#

Using `Then`, this combinator could be used with pipeline composition:

    run(OneTo(6) >> Then(FirstHalf))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        1 │
    2 │        2 │
    3 │        3 │
    =#

In DataKnots, filtering and slicing are realized as pipeline
components. They are attached to data processing pipelines using the
composition combinator. This brings common data processing concepts
into our pipeline algebra.

### Query Parameters

With DataKnots, parameters can be provided so that static data can
be used within query expressions. By convention, we use upper case,
singular labels for query parameters.

    run("Hello " .* Lookup(:WHO), WHO="World")
    #=>
    │ DataKnot    │
    ├─────────────┤
    │ Hello World │
    =#

To make `Lookup` convenient, `It` provides a shorthand syntax.

    run("Hello " .* It.WHO, WHO="World")
    #=>
    │ DataKnot    │
    ├─────────────┤
    │ Hello World │
    =#

Query parameters are available anywhere in the query. They could,
for example be used within a filter.

    query = OneTo(6) >> Filter(It .> It.START)
    run(query, START=3)
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        4 │
    2 │        5 │
    3 │        6 │
    =#

Parameters can also be defined as part of a query using `Given`. This
combinator takes set of pairs (`=>`) that map symbols (`:name`) onto
query expressions. The subsequent argument is then evaluated in a
naming context where the defined parameters are available for reuse.

    run(Given(:WHO => "World",
        "Hello " .* Lookup(:WHO)))
    #=>
    │ DataKnot    │
    ├─────────────┤
    │ Hello World │
    =#

Query parameters can be especially useful when managing aggregates, or
with expressions that one may wish to repeat more than once.

    GreaterThanAverage(X) =
      Given(:AVG => Mean(X),
            X >> Filter(It .> Lookup(:AVG)))

    run(OneTo(6) >> Then(GreaterThanAverage))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        4 │
    2 │        5 │
    3 │        6 │
    =#

In DataKnots, query parameters passed in to the `run` command permit
external data to be used within query expressions. Parameters that are
defined with `Given` can be used to remember values and reuse them.

### Records & Labels

Internally, DataKnots use a column-oriented storage mechanism that
handles hierarchies and graphs. Data objects in this model can be
created using the `Record` combinator.

    GM = Record(:name => "GARRY M", :salary => 260004)
    run(GM)
    #=>
    │ DataKnot        │
    │ name     salary │
    ├─────────────────┤
    │ GARRY M  260004 │
    =#

Field access is also possible via `Lookup` or via the `It` shortcut.

    run(GM >> It.name)
    #=>
    │ name    │
    ├─────────┤
    │ GARRY M │
    =#

As seen in the output above, field names also act as display labels.
It is possible to provide a name to any expression with the `Label`
combinator. Labeling doesn't affect the actual output, only the field
name given to the expression and its display.

    run(Lift("Hello World") >> Label(:greeting))
    #=>
    │ greeting    │
    ├─────────────┤
    │ Hello World │
    =#

Alternatively, Julia's pair constructor (`=>`) and and a `Symbol`
denoted by a colon (`:`) can be used to label an expression.

    Hello = :greeting => Lift("Hello World")
    run(Hello)
    #=>
    │ greeting    │
    ├─────────────┤
    │ Hello World │
    =#

When a record is created, it can use the label from which it
originates. In this case, the `:greeting` label from the `Hello` is
used to make the field label used within the `Record`. The record
itself is also expressly labeled.

    run(:seasons => Record(Hello))
    #=>
    │ seasons     │
    │ greeting    │
    ├─────────────┤
    │ Hello World │
    =#

Records can be plural. Here is a table of obvious statistics.

    Stats = Record(:n¹=>It, :n²=>It.*It, :n³=>It.*It.*It)
    run(Lift(1:3) >> Stats)
    #=>
      │ DataKnot   │
      │ n¹  n²  n³ │
    ──┼────────────┤
    1 │  1   1   1 │
    2 │  2   4   8 │
    3 │  3   9  27 │
    =#

Calculations could be run on record sets as follows:

    run(Lift(1:3) >> Stats >> (It.n² .+ It.n³))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        2 │
    2 │       12 │
    3 │       36 │
    =#

Any values can be used within a Record, including other records and
plural values.

    run(:work_schedule =>
     Record(:staff => Record(:name => "Jim Rockford",
                             :phone => "555-2368"),
            :workday => Lift(["Su", "M","Tu", "F"])))
    #=>
    │ work_schedule                        │
    │ staff                   workday      │
    ├──────────────────────────────────────┤
    │ Jim Rockford, 555-2368  Su; M; Tu; F │
    =#

In DataKnots, records are used to generate tabular data. Using nested
records, it is possible to represent complex, hierarchical data.

## Working With Data

Arrays of named tuples can be wrapped with `Lift` in order to provide
a series of tuples. Since DataKnots works fluidly with Julia, any sort
of Julia object may be used. In this case, `NamedTuple` has special
support so that it prints well.

    DATA = Lift([(name = "GARRY M", salary = 260004),
                  (name = "ANTHONY R", salary = 185364),
                  (name = "DANA A", salary = 170112)])

    run(:staff => DATA)
    #=>
      │ staff             │
      │ name       salary │
    ──┼───────────────────┤
    1 │ GARRY M    260004 │
    2 │ ANTHONY R  185364 │
    3 │ DANA A     170112 │
    =#

Access to slots in a `NamedTuple` is also supported by `Lookup`.

    run(DATA >> Lookup(:name))
    #=>
      │ name      │
    ──┼───────────┤
    1 │ GARRY M   │
    2 │ ANTHONY R │
    3 │ DANA A    │
    =#

Together with previous combinators, DataKnots could be used to create
readable queries, such as "who has the greatest salary"?

    run(:highest_salary =>
      Given(:MAX => Max(DATA >> It.salary),
            DATA >> Filter(It.salary .== Lookup(:MAX))))
    #=>
      │ highest_salary  │
      │ name     salary │
    ──┼─────────────────┤
    1 │ GARRY M  260004 │
    =#

Records can even contain lists of subordinate records.

    DB =
      run(:department =>
        Record(:name => "FIRE", :staff => It.FIRE),
        FIRE=[(name = "JOSE S", salary = 202728),
              (name = "CHARLES S", salary = 197736)])
    #=>
    │ department                              │
    │ name  staff                             │
    ├─────────────────────────────────────────┤
    │ FIRE  JOSE S, 202728; CHARLES S, 197736 │
    =#

These subordinate records can then be summarized.

    run(:statistics =>
      DB >> Record(:dept => It.name,
                   :count => Count(It.staff)))
    #=>
    │ statistics  │
    │ dept  count │
    ├─────────────┤
    │ FIRE      2 │
    =#

## Quirks

By *quirks* we mean unexpected consequences of embedding DataKnots in
Julia. They are not necessarily bugs, nor could they be easily fixed.

Using the broadcast syntax to lift combinators is a clever shortcut,
but it doesn't always work out. If an argument to the broadcast isn't a
`Pipeline` then a regular broadcast will happen. For example,
`rand.(1:3)` is an array of arrays containing random numbers. Wrapping
an argument in `Lift` will address this challenge. The following will
generate 3 random numbers from `1` to `3`.

    using Random: seed!, rand
    seed!(0)
    run(Lift(1:3) >> rand.(Lift(7:9)))
    #=>
      │ DataKnot │
    ──┼──────────┤
    1 │        7 │
    2 │        9 │
    3 │        8 │
    =#


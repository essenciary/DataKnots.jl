# Column Store


## Overview

Given an assorted collection of atomic types, there are two ways to make composite
types out of them.  We can make a variable-size collection of homogeneous values, called
a *vector*.  We can also make a fixed-size collection of heterogeneous values, called
a *tuple*.  Examples of a vector and a tuple are below.

A list of employee names could be represented with a vector.

    ["JEFFERY A", "JAMES A", "TERRY A", "LAKENYA A"]

To specify the name, position and salary of an employee, we could use a (named) tuple.

    (name = "JEFFERY A", position = "SERGEANT", salary = 101442)

When it comes to representing tabular data, we have two choices.  We can use tuples
to represent table rows, then the whole table is encoded as a vector of tuples.  Alternatively,
we can put each table of the column in a separate vector, and represent the whole table
as a tuple of vectors of the same size.  These two approaches are illustrated in the following example.

| name      | position          | salary    |
| --------- | ----------------- | --------- |
| JEFFERY A | SERGEANT          | 101442    |
| JAMES A   | FIRE ENGINEER-EMT | 103350    |
| TERRY A   | POLICE OFFICER    | 93354     |

In the row-oriented format, we encode this table as a vector of tuples.

    [(name = "JEFFERY A", position = "SERGEANT", salary = 101442),
     (name = "JAMES A", position = "FIRE ENGINEER-EMT", salary = 103350),
     (name = "TERRY A", position = "POLICE OFFICER", salary = 93354)]

In the column-oriented format, we use a tuple of vectors.

    (name = ["JEFFERY A", "JAMES A", "TERRY A"],
     position = ["SERGEANT", "FIRE ENGINEER-EMT", "POLICE OFFICER"],
     salary = [101442, 103350, 93354])

Row-oriented data layout is common in traditional programming practice and databases.

Column-oriented data layout is often used by analytical databases. It's advantage is in
the fact that the data could be processed more efficiently.

The module `DataKnots.Vectors` implements necessary data structures to support
collumn-oriented data layout for complex tabular, nested and circular data.

In particular, tabular data could be represented using `TupleVector` objects.

```julia
TupleVector(:name => ["JEFFERY A", "JAMES A", "TERRY A"],
            :position => ["SERGEANT", "FIRE ENGINEER-EMT", "POLICE OFFICER"],
            :salary => [101442, 103350, 93354])
```

However, this structure is not sufficient to represent real tabular data.  The reason is
that tabular data that is encountered in practice may contain empty cells.  Continuing
with the previous example, we may have some employees with annual salary, and others on
hourly rate.  In the tabular representation, we could represent this by adding a second
column `rate`.

| name      | position          | salary    | rate  |
| --------- | ----------------- | --------- | ----- |
| JEFFERY A | SERGEANT          | 101442    |       |
| JAMES A   | FIRE ENGINEER-EMT | 103350    |       |
| TERRY A   | POLICE OFFICER    | 93354     |       |
| LAKENYA A | CROSSING GUARD    |           | 17.68 |

How could this data be represented in column-oriented form?  In order to retain the
advantages of the format, we'd like to keep the data in tightly packed vectors.

    ["JEFFERY A", "JAMES A", "TERRY A", "LAKENYA A"]
    ["SERGEANT", "FIRE ENGINEER-EMT", "POLICE OFFICER", "CROSSING GUARD"]
    [101442, 103350, 93354]
    [17.68]

What we lost is the correspondence between columns and rows.  To restore this correspondence,
we will partition the data vectors into 4 (the number of rows) blocks.  A partition
could be specified with an *offset* vector, which is a vector of indices of the data
vector, where each pair of adjacent indices specifies the boundaries of the corresponding
block.

    [1, 2, 3, 4, 5]
    [1, 2, 3, 4, 5]
    [1, 2, 3, 4, 4]
    [1, 1, 1, 1, 2]

Thus, to specify the column, we need to provide a data vector of consequent values and an offset
vector to partition this data.  `DataKnots.Vectors` provides a `BlockVector` objects which
encapsulates the elements vector and the offset vector in a single object.

```julia
BlockVector(:, ["JEFFERY A", "JAMES A", "TERRY A", "LAKENYA A"])
BlockVector(:, ["SERGEANT", "FIRE ENGINEER-EMT", "POLICE OFFICER", "CROSSING GUARD"])
BlockVector([1, 2, 3, 4, 4], [101442, 103350, 93354])
BlockVector([1, 1, 1, 1, 2], [17.68])
```

Now that the correspondence between rows and columns is restored, we could wrap the columns
in a `TupleVector`.

```julia
TupleVector(
    :name => BlockVector(:, ["JEFFERY A", "JAMES A", "TERRY A", "LAKENYA A"]),
    :position => BlockVector(:, ["SERGEANT", "FIRE ENGINEER-EMT", "POLICE OFFICER", "CROSSING GUARD"]),
    :salary => BlockVector([1, 2, 3, 4, 4], [101442, 103350, 93354]),
    :rate => BlockVector([1, 1, 1, 1, 2], [17.68]))
```

Here, `:` is a shortcut for the arithmetic progression `[1, 2, 3, 4, 5]`.


## API Reference


## Test Suite

For efficient data processing, an array of composite data can be stored in a
column-oriented form: as a collection of arrays with primitive data.

    using DataKnots.Vectors

### `TupleVector`

`TupleVector` is a vector of tuples stored as a collection of parallel vectors.

    tv = TupleVector(:name => ["GARRY M", "ANTHONY R", "DANA A"],
                     :salary => [260004, 185364, 170112])
    #-> @VectorTree (name = String, salary = Int) [(name = "GARRY M", salary = 260004) … ]

    display(tv)
    #=>
    TupleVector of 3 × (name = String, salary = Int):
     (name = "GARRY M", salary = 260004)
     (name = "ANTHONY R", salary = 185364)
     (name = "DANA A", salary = 170112)
    =#

It is possible to construct a `TupleVector` without labels.

    TupleVector(length(tv), columns(tv))
    #-> @VectorTree (String, Int) [("GARRY M", 260004) … ]

An error is reported in case of duplicate labels or columns of different height.

    TupleVector(:name => ["GARRY M", "ANTHONY R"],
                :name => ["DANA A", "JUAN R"])
    #-> ERROR: duplicate column label :name

    TupleVector(:name => ["GARRY M", "ANTHONY R"],
                :salary => [260004, 185364, 170112])
    #-> ERROR: unexpected column height

We can access individual components of the vector.

    labels(tv)
    #-> Symbol[:name, :salary]

    width(tv)
    #-> 2

    column(tv, 2)
    #-> [260004, 185364, 170112]

    column(tv, :salary)
    #-> [260004, 185364, 170112]

    columns(tv)
    #-> …[["GARRY M", "ANTHONY R", "DANA A"], [260004, 185364, 170112]]

When indexed by another vector, we get a new instance of `TupleVector`.

    tv′ = tv[[3,1]]
    display(tv′)
    #=>
    TupleVector of 2 × (name = String, salary = Int):
     (name = "DANA A", salary = 170112)
     (name = "GARRY M", salary = 260004)
    =#

Note that the new instance keeps a reference to the index and the original
column vectors.  Updated column vectors are generated on demand.

    column(tv′, 2)
    #-> [170112, 260004]


### `BlockVector`

`BlockVector` is a vector of homogeneous vectors (blocks) stored as a vector of
elements partitioned into individual blocks by a vector of offsets.

    bv = BlockVector([["HEALTH"], ["FINANCE", "HUMAN RESOURCES"], [], ["POLICE", "FIRE"]])
    #-> @VectorTree [String] ["HEALTH", ["FINANCE", "HUMAN RESOURCES"], missing, ["POLICE", "FIRE"]]

    display(bv)
    #=>
    BlockVector of 4 × [String]:
     "HEALTH"
     ["FINANCE", "HUMAN RESOURCES"]
     missing
     ["POLICE", "FIRE"]
    =#

We can omit brackets for singular blocks and use `missing` in place of empty
blocks.

    BlockVector(["HEALTH", ["FINANCE", "HUMAN RESOURCES"], missing, ["POLICE", "FIRE"]])
    #-> @VectorTree [String] ["HEALTH", ["FINANCE", "HUMAN RESOURCES"], missing, ["POLICE", "FIRE"]]

It is possible to specify the offset and the element vectors separately.

    BlockVector([1, 2, 4, 4, 6], ["HEALTH", "FINANCE", "HUMAN RESOURCES", "POLICE", "FIRE"])
    #-> @VectorTree [String] ["HEALTH", ["FINANCE", "HUMAN RESOURCES"], missing, ["POLICE", "FIRE"]]

If each block contains exactly one element, we could use `:` in place of the
offset vector.

    BlockVector(:, ["HEALTH", "FINANCE", "HUMAN RESOURCES", "POLICE", "FIRE"])
    #-> @VectorTree [String] ["HEALTH", "FINANCE", "HUMAN RESOURCES", "POLICE", "FIRE"]

The `BlockVector` constructor verifies that the offset vector is well-formed.

    BlockVector(Base.OneTo(0), [])
    #-> ERROR: partition must be non-empty

    BlockVector(Int[], [])
    #-> ERROR: partition must be non-empty

    BlockVector([0], [])
    #-> ERROR: partition must start with 1

    BlockVector([1,2,2,1], ["HEALTH"])
    #-> ERROR: partition must be monotone

    BlockVector(Base.OneTo(4), ["HEALTH", "FINANCE"])
    #-> ERROR: partition must enclose the elements

    BlockVector([1,2,3,6], ["HEALTH", "FINANCE"])
    #-> ERROR: partition must enclose the elements

We can access individual components of the vector.

    offsets(bv)
    #-> [1, 2, 4, 4, 6]

    elements(bv)
    #-> ["HEALTH", "FINANCE", "HUMAN RESOURCES", "POLICE", "FIRE"]

    partition(bv)
    #-> ([1, 2, 4, 4, 6], ["HEALTH", "FINANCE", "HUMAN RESOURCES", "POLICE", "FIRE"])

When indexed by a vector of indexes, an instance of `BlockVector` is returned.

    elts = ["POLICE", "FIRE", "HEALTH", "AVIATION", "WATER MGMNT", "FINANCE"]

    reg_bv = BlockVector(:, elts)
    #-> @VectorTree [String] ["POLICE", "FIRE", "HEALTH", "AVIATION", "WATER MGMNT", "FINANCE"]

    opt_bv = BlockVector([1, 2, 3, 3, 4, 4, 5, 6, 6, 6, 7], elts)
    #-> @VectorTree [String] ["POLICE", "FIRE", missing, "HEALTH", missing, "AVIATION", "WATER MGMNT", missing, missing, "FINANCE"]

    plu_bv = BlockVector([1, 1, 1, 2, 2, 4, 4, 6, 7], elts)
    #-> @VectorTree [String] [missing, missing, "POLICE", missing, ["FIRE", "HEALTH"], missing, ["AVIATION", "WATER MGMNT"], "FINANCE"]

    reg_bv[[1,3,5,3]]
    #-> @VectorTree [String] ["POLICE", "HEALTH", "WATER MGMNT", "HEALTH"]

    plu_bv[[1,3,5,3]]
    #-> @VectorTree [String] [missing, "POLICE", ["FIRE", "HEALTH"], "POLICE"]

    reg_bv[Base.OneTo(4)]
    #-> @VectorTree [String] ["POLICE", "FIRE", "HEALTH", "AVIATION"]

    reg_bv[Base.OneTo(6)]
    #-> @VectorTree [String] ["POLICE", "FIRE", "HEALTH", "AVIATION", "WATER MGMNT", "FINANCE"]

    plu_bv[Base.OneTo(6)]
    #-> @VectorTree [String] [missing, missing, "POLICE", missing, ["FIRE", "HEALTH"], missing]

    opt_bv[Base.OneTo(10)]
    #-> @VectorTree [String] ["POLICE", "FIRE", missing, "HEALTH", missing, "AVIATION", "WATER MGMNT", missing, missing, "FINANCE"]


### `IndexVector`

`IndexVector` is a vector of indexes in some named vector.

    iv = IndexVector(:REF, [1, 1, 1, 2])
    #-> @VectorTree &REF [1, 1, 1, 2]

    display(iv)
    #=>
    IndexVector of 4 × &REF:
     1
     1
     1
     2
    =#

We can obtain the components of the vector.

    identifier(iv)
    #-> :REF

    indexes(iv)
    #-> [1, 1, 1, 2]

Indexing an `IndexVector` by a vector produces another `IndexVector` instance.

    iv[[4,2]]
    #-> @VectorTree &REF [2, 1]

`IndexVector` can be deferenced against a list of named vectors.

    refv = ["COMISSIONER", "DEPUTY COMISSIONER", "ZONING ADMINISTRATOR", "PROJECT MANAGER"]

    dereference(iv, [:REF => refv])
    #-> ["COMISSIONER", "COMISSIONER", "COMISSIONER", "DEPUTY COMISSIONER"]

Function `dereference()` has no effect on other types of vectors, or when the
desired reference vector is not in the list.

    dereference(iv, [:REF′ => refv])
    #-> @VectorTree &REF [1, 1, 1, 2]

    dereference([1, 1, 1, 2], [:REF => refv])
    #-> [1, 1, 1, 2]


### `CapsuleVector`

`CapsuleVector` provides references for a composite vector with nested indexes.
We use `CapsuleVector` to represent self-referential and mutually referential
data.

    cv = CapsuleVector(TupleVector(:ref => iv), :REF => refv)
    #-> @VectorTree (ref = &REF,) [(ref = 1,), (ref = 1,), (ref = 1,), (ref = 2,)] where {REF = [ … ]}

    display(cv)
    #=>
    CapsuleVector of 4 × (ref = &REF,):
     (ref = 1,)
     (ref = 1,)
     (ref = 1,)
     (ref = 2,)
    where
     REF = ["COMISSIONER", "DEPUTY COMISSIONER" … ]
    =#

Function `decapsulate()` decomposes a capsule into the underlying vector and a
list of references.

    decapsulate(cv)
    #-> (@VectorTree (ref = &REF,) [ … ], Pair{Symbol,AbstractArray{T,1} where T}[ … ])

Function `recapsulate()` applies the given function to the underlying vector
and encapsulates the output of the function.

    cv′ = recapsulate(v -> v[:, :ref], cv)
    #-> @VectorTree &REF [1, 1, 1, 2] where {REF = [ … ]}

We could dereference `CapsuleVector` if it wraps an `IndexVector` instance.
Function `dereference()` has no effect otherwise.

    dereference(cv′)
    #-> ["COMISSIONER", "COMISSIONER", "COMISSIONER", "DEPUTY COMISSIONER"]

    dereference(cv)
    #-> @VectorTree (ref = &REF,) [(ref = 1,), (ref = 1,), (ref = 1,), (ref = 2,)] where {REF = [ … ]}

Indexing `CapsuleVector` by a vector produces another instance of
`CapsuleVector`.

    cv[[4,2]]
    #-> @VectorTree (ref = &REF,) [(ref = 2,), (ref = 1,)] where {REF = [ … ]}


### `@VectorTree`

We can use `@VectorTree` macro to convert vector literals to the columnar form
assembled with `TupleVector`, `BlockVector`, `IndexVector`, and
`CapsuleVector`.

`TupleVector` is created from a matrix or a vector of (named) tuples.

    @VectorTree (name = String, salary = Int) [
        "GARRY M"   260004
        "ANTHONY R" 185364
        "DANA A"    170112
    ]
    #-> @VectorTree (name = String, salary = Int) [(name = "GARRY M", salary = 260004) … ]

    @VectorTree (name = String, salary = Int) [
        ("GARRY M", 260004),
        ("ANTHONY R", 185364),
        ("DANA A", 170112),
    ]
    #-> @VectorTree (name = String, salary = Int) [(name = "GARRY M", salary = 260004) … ]

    @VectorTree (name = String, salary = Int) [
        (name = "GARRY M", salary = 260004),
        (name = "ANTHONY R", salary = 185364),
        (name = "DANA A", salary = 170112),
    ]
    #-> @VectorTree (name = String, salary = Int) [(name = "GARRY M", salary = 260004) … ]

Column labels are optional.

    @VectorTree (String, Int) ["GARRY M" 260004; "ANTHONY R" 185364; "DANA A" 170112]
    #-> @VectorTree (String, Int) [("GARRY M", 260004) … ]

`BlockVector` and `IndexVector` can also be constructed.

    @VectorTree [String] [
        "HEALTH",
        ["FINANCE", "HUMAN RESOURCES"],
        missing,
        ["POLICE", "FIRE"],
    ]
    #-> @VectorTree [String] ["HEALTH", ["FINANCE", "HUMAN RESOURCES"], missing, ["POLICE", "FIRE"]]

    @VectorTree &REF [1, 1, 1, 2]
    #-> @VectorTree &REF [1, 1, 1, 2]

A `CapsuleVector` could be constructed using `where` syntax.

    @VectorTree &REF [1, 1, 1, 2] where {REF = refv}
    #-> @VectorTree &REF [1, 1, 1, 2] where {REF = ["COMISSIONER", "DEPUTY COMISSIONER"  … ]}

Ill-formed `@VectorTree` contructors are rejected.

    @VectorTree (String, Int) ("GARRY M", 260004)
    #=>
    ERROR: LoadError: expected a vector literal; got :(("GARRY M", 260004))
    in expression starting at vectors.md:319
    =#

    @VectorTree (String, Int) [(position = "SUPERINTENDENT OF POLICE", salary = 260004)]
    #=>
    ERROR: LoadError: expected no label; got :(position = "SUPERINTENDENT OF POLICE")
    in expression starting at vectors.md:325
    =#

    @VectorTree (name = String, salary = Int) [(position = "SUPERINTENDENT OF POLICE", salary = 260004)]
    #=>
    ERROR: LoadError: expected label :name; got :(position = "SUPERINTENDENT OF POLICE")
    in expression starting at vectors.md:331
    =#

    @VectorTree (name = String, salary = Int) [("GARRY M", "SUPERINTENDENT OF POLICE", 260004)]
    #=>
    ERROR: LoadError: expected 2 column(s); got :(("GARRY M", "SUPERINTENDENT OF POLICE", 260004))
    in expression starting at vectors.md:337
    =#

    @VectorTree (name = String, salary = Int) ["GARRY M"]
    #=>
    ERROR: LoadError: expected a tuple or a row literal; got "GARRY M"
    in expression starting at vectors.md:343
    =#

    @VectorTree &REF [[]] where (:REF => [])
    #=>
    ERROR: LoadError: expected an assignment; got :(:REF => [])
    in expression starting at vectors.md:349
    =#

Using `@VectorTree`, we can easily construct hierarchical and mutually
referential data.

    hier_data = @VectorTree (name = [String], employee = [(name = [String], salary = [Int])]) [
        "POLICE"    ["GARRY M" 260004; "ANTHONY R" 185364; "DANA A" 170112]
        "FIRE"      ["JOSE S" 202728; "CHARLES S" 197736]
    ]
    display(hier_data)
    #=>
    TupleVector of 2 × (name = [String], employee = [(name = [String], salary = [Int])]):
     (name = "POLICE", employee = [(name = "GARRY M", salary = 260004) … ])
     (name = "FIRE", employee = [(name = "JOSE S", salary = 202728) … ])
    =#

    mref_data = @VectorTree (department = [&DEPT], employee = [&EMP]) [
        [1, 2]  [1, 2, 3, 4, 5]
    ] where {
        DEPT = @VectorTree (name = [String], employee = [&EMP]) [
            "POLICE"    [1, 2, 3]
            "FIRE"      [4, 5]
        ]
        ,
        EMP = @VectorTree (name = [String], department = [&DEPT], salary = [Int]) [
            "GARRY M"   1   260004
            "ANTHONY R" 1   185364
            "DANA A"    1   170112
            "JOSE S"    2   202728
            "CHARLES S" 2   197736
        ]
    }
    display(mref_data)
    #=>
    CapsuleVector of 1 × (department = [&DEPT], employee = [&EMP]):
     (department = [1, 2], employee = [1, 2, 3, 4, 5])
    where
     DEPT = @VectorTree (name = [String], employee = [&EMP]) [(name = "POLICE", employee = [1, 2, 3]) … ]
     EMP = @VectorTree (name = [String], department = [&DEPT], salary = [Int]) [(name = "GARRY M", department = 1, salary = 260004) … ]
    =#

var documenterSearchIndex = {"docs": [

{
    "location": "index.html#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "index.html#DataKnots.jl-1",
    "page": "Home",
    "title": "DataKnots.jl",
    "category": "section",
    "text": "DataKnots is a Julia library for representing and querying data, including nested and circular structures.  DataKnots provides integration and analytics across CSV, JSON, XML and SQL data sources with an extensible, practical and coherent algebra of query combinators."
},

{
    "location": "index.html#Contents-1",
    "page": "Home",
    "title": "Contents",
    "category": "section",
    "text": "Pages = [\n    \"install.md\",\n    \"usage.md\",\n    \"implementation.md\",\n]"
},

{
    "location": "index.html#Index-1",
    "page": "Home",
    "title": "Index",
    "category": "section",
    "text": ""
},

{
    "location": "install.html#",
    "page": "Installation Instructions",
    "title": "Installation Instructions",
    "category": "page",
    "text": ""
},

{
    "location": "install.html#Installation-Instructions-1",
    "page": "Installation Instructions",
    "title": "Installation Instructions",
    "category": "section",
    "text": "DataKnots.jl is a Julia library, but it is not yet registered with the Julia package manager.  To install it, run in the package shell (enter with ] from the Julia shell):pkg> add https://github.com/rbt-lang/DataKnots.jlDataKnots.jl requires Julia 0.7 or higher.If you want to modify the source code of DataKnots.jl, you need to install it in development mode with:pkg> dev https://github.com/rbt-lang/DataKnots.jl"
},

{
    "location": "usage.html#",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "page",
    "text": ""
},

{
    "location": "usage.html#Usage-Guide-1",
    "page": "Usage Guide",
    "title": "Usage Guide",
    "category": "section",
    "text": ""
},

{
    "location": "usage.html#What-is-a-DataKnot?-1",
    "page": "Usage Guide",
    "title": "What is a DataKnot?",
    "category": "section",
    "text": "A DataKnot is an in-memory column store.  It may contain tabular data, a collection of interrelated tables, or hierarchical data such as JSON or XML. It can also serve as an interface to external data sources such as SQL databases.To start working with DataKnots, we import the package:using DataKnots"
},

{
    "location": "usage.html#Querying-tabular-data-1",
    "page": "Usage Guide",
    "title": "Querying tabular data",
    "category": "section",
    "text": "In this section, we demonstrate how to use DataKnots.jl to query tabular data.First, we load some sample data from a CSV file.  We use the (???) data set, which is packaged as a part of DataKnots.jl.# Path to ???.csv.\nDATA = joinpath(Base.find_package(\"DataKnots\"),\n                \"test/data/???.csv\")\n\nusedb!(data = LoadCSV(DATA))This command loads tabular data from ???.csv and adds it to the current database under the name data.  We can now query it.Show the whole dataset.@query data\n#=>\n...\n=#Show all the salaries.@query data.salary\n#=>\n...\n=#Show the number of rows in the dataset.@query count(data)\n#=>\n...\n=#Show the mean salary.@query mean(data.salary)\n#=>\n...\n=#Show all employees with annual salary higher than 100000.@query data.filter(salary>100000)\n#=>\n...\n=#Show the number of employees with annual salary higher than 100000.@query count(data.filter(salary>100000))\n#=>\n...\n=#Show the top ten employees ordered by salary.@query data.sort(salary.desc()).select(name, salary).take(10)\n#=>\n...\n=#A long query could be split into several lines.@query begin\n    data\n    sort(salary.desc())\n    select(name, salary)\n    take(10)\nend\n#=>\n...\n=#DataKnots.jl implements an algebra of query combinators.  In this algebra, its elements are queries, which represents relationships among classes and data types.  This algebra\'s operations are combinators, which are applied to construct query expressions."
},

{
    "location": "implementation.html#",
    "page": "Implementation Guide",
    "title": "Implementation Guide",
    "category": "page",
    "text": ""
},

{
    "location": "implementation.html#Implementation-Guide-1",
    "page": "Implementation Guide",
    "title": "Implementation Guide",
    "category": "section",
    "text": "Pages = [\n    \"layouts.md\",\n    \"vectors.md\",\n    \"shapes.md\",\n    \"queries.md\",\n    \"combinators.md\",\n    \"lifting.md\",\n]"
},

{
    "location": "layouts.html#",
    "page": "Optimal Layouts",
    "title": "Optimal Layouts",
    "category": "page",
    "text": ""
},

{
    "location": "layouts.html#Optimal-Layouts-1",
    "page": "Optimal Layouts",
    "title": "Optimal Layouts",
    "category": "section",
    "text": ""
},

{
    "location": "layouts.html#Overview-1",
    "page": "Optimal Layouts",
    "title": "Overview",
    "category": "section",
    "text": "In DataKnots.jl, we often need to visualize composite data structures or complex Julia expressions.  For this purpose, module DataKnots.Layouts implements a pretty-printing engine.using DataKnots.LayoutsTo format a data structure, we need to encode its possible layouts in the form of a layout expression.A fixed single-line layout is created with Layouts.literal().Layouts.literal(\"department\")\n#-> literal(\"department\")Layouts could be combined using horizontal and vertical composition operators.lhz = Layouts.literal(\"department\") * Layouts.literal(\".\") * Layouts.literal(\"name\")\n#-> literal(\"department.name\")\n\nlvt = Layouts.literal(\"department\") / Layouts.literal(\"name\")\n#-> literal(\"department\") / literal(\"name\")Function Layouts.pretty_print() serializes the layout.pretty_print(lhz)\n#-> department.name\n\npretty_print(lvt)\n#=>\ndepartment\nname\n=#To indicate that we can choose between several different layouts, use the choice operator.l = lhz | lvt\n#-> literal(\"department.name\") | literal(\"department\") / literal(\"name\")The pretty-printing engine can search through possible layouts to find the best fit, which is expressed as a layout expression without a choice operator.Layouts.best(Layouts.fit(l))\n#-> literal(\"department.name\")The module implements the optimal layout algorithm described in https://research.google.com/pubs/pub44667.html."
},

{
    "location": "layouts.html#DataKnots.Layouts.pretty_print",
    "page": "Optimal Layouts",
    "title": "DataKnots.Layouts.pretty_print",
    "category": "function",
    "text": "Layouts.pretty_print([io::IO], data)\n\nFormats the data so that it fits the width of the output screen.\n\n\n\n\n\n"
},

{
    "location": "layouts.html#DataKnots.Layouts.print_code",
    "page": "Optimal Layouts",
    "title": "DataKnots.Layouts.print_code",
    "category": "function",
    "text": "Layouts.print_code([io::IO], code)\n\nFormats a Julia expression.\n\n\n\n\n\n"
},

{
    "location": "layouts.html#API-Reference-1",
    "page": "Optimal Layouts",
    "title": "API Reference",
    "category": "section",
    "text": "DataKnots.Layouts.pretty_print\nDataKnots.Layouts.print_code"
},

{
    "location": "layouts.html#Test-Suite-1",
    "page": "Optimal Layouts",
    "title": "Test Suite",
    "category": "section",
    "text": "We start with creating a simple tree structure.struct Node\n    name::Symbol\n    arms::Vector{Node}\nend\n\nNode(name) = Node(name, [])\n\ntree =\n    Node(:a, [Node(:an, [Node(:anchor, [Node(:anchorage), Node(:anchorite)]),\n                           Node(:anchovy),\n                           Node(:antic, [Node(:anticipation)])]),\n               Node(:arc, [Node(:arch, [Node(:archduke), Node(:archer)])]),\n               Node(:awl)])\n#-> Node(:a, Main.layouts.md.Node[ … ])To specify a layout expression for Node objects, we need to override Layout.tile().  Layout expressions are assembled from Layouts.literal() primitives using operators * (horizontal composition), / (vertical composition), and | (choice).function Layouts.tile(tree::Node)\n    if isempty(tree.arms)\n        return Layouts.literal(\"Node($(repr(tree.name)))\")\n    end\n    arm_lts = [Layouts.tile(arm) for arm in tree.arms]\n    v_lt = h_lt = nothing\n    for (k, arm_lt) in enumerate(arm_lts)\n        if k == 1\n            v_lt = arm_lt\n            h_lt = Layouts.nobreaks(arm_lt)\n        else\n            v_lt = v_lt * Layouts.literal(\",\") / arm_lt\n            h_lt = h_lt * Layouts.literal(\", \") * Layouts.nobreaks(arm_lt)\n        end\n    end\n    return Layouts.literal(\"Node($(repr(tree.name)), [\") *\n           (v_lt | h_lt) *\n           Layouts.literal(\"])\")\nendNow we can use function pretty_print() to render a nicely formatted representation of the tree.pretty_print(stdout, tree)\n#=>\nNode(:a, [Node(:an, [Node(:anchor, [Node(:anchorage), Node(:anchorite)]),\n                     Node(:anchovy),\n                     Node(:antic, [Node(:anticipation)])]),\n          Node(:arc, [Node(:arch, [Node(:archduke), Node(:archer)])]),\n          Node(:awl)])\n=#We can control the width of the output.pretty_print(IOContext(stdout, :displaysize => (24, 60)), tree)\n#=>\nNode(:a, [Node(:an, [Node(:anchor, [Node(:anchorage),\n                                    Node(:anchorite)]),\n                     Node(:anchovy),\n                     Node(:antic, [Node(:anticipation)])]),\n          Node(:arc, [Node(:arch, [Node(:archduke),\n                                   Node(:archer)])]),\n          Node(:awl)])\n=#We can display the layout expression itself, both the original and the optimized variants.Layouts.tile(tree)\n#=>\nliteral(\"Node(:a, [\")\n* (literal(\"Node(:an, [\")\n   * (literal(\"Node(:anchor, [\")\n   ⋮\n=#\n\nLayouts.best(Layouts.fit(stdout, Layouts.tile(tree)))\n#=>\nliteral(\"Node(:a, [\")\n* (literal(\"Node(:an, [\")\n   * (literal(\"Node(:anchor, [Node(:anchorage), Node(:anchorite)]),\")\n   ⋮\n=#For some built-in data structures, automatic layout is already provided.data = [\n    (name = \"RICHARD A\", position = \"FIREFIGHTER\", salary = 90018),\n    (name = \"DEBORAH A\", position = \"POLICE OFFICER\", salary = 86520),\n    (name = \"KATHERINE A\", position = \"PERSONAL COMPUTER OPERATOR II\", salary = 60780)\n]\n\npretty_print(data)\n#=>\n[(name = \"RICHARD A\", position = \"FIREFIGHTER\", salary = 90018),\n (name = \"DEBORAH A\", position = \"POLICE OFFICER\", salary = 86520),\n (name = \"KATHERINE A\",\n  position = \"PERSONAL COMPUTER OPERATOR II\",\n  salary = 60780)]\n=#This includes Julia syntax trees.Q = :(\n    Employee\n    >> ThenFilter(Department >> Name .== \"POLICE\")\n    >> ThenSort(Salary >> Desc)\n    >> ThenSelect(Name, Position, Salary)\n    >> ThenTake(10)\n)\n\nprint_code(Q)\n#=>\nEmployee\n>> ThenFilter(Department >> Name .== \"POLICE\")\n>> ThenSort(Salary >> Desc)\n>> ThenSelect(Name, Position, Salary)\n>> ThenTake(10)\n=#"
},

{
    "location": "vectors.html#",
    "page": "Column Store",
    "title": "Column Store",
    "category": "page",
    "text": ""
},

{
    "location": "vectors.html#Column-Store-1",
    "page": "Column Store",
    "title": "Column Store",
    "category": "section",
    "text": ""
},

{
    "location": "vectors.html#Overview-1",
    "page": "Column Store",
    "title": "Overview",
    "category": "section",
    "text": "Module DataKnots.Vectors implements an in-memory column store.using DataKnots.Vectors"
},

{
    "location": "vectors.html#Tabular-data-1",
    "page": "Column Store",
    "title": "Tabular data",
    "category": "section",
    "text": "Consider a tabular structure, like in the following example.name position salary\nJEFFERY A SERGEANT 101442\nJAMES A FIRE ENGINEER-EMT 103350\nTERRY A POLICE OFFICER 93354How can a database engine store the data in this table?In general, there are two ways to assemble composite data structures.  We can make a fixed-size collection of heterogeneous values called a tuple.  We can also make a variable-size collection of homogeneous values called a vector.A tuple can represent a row in the table above.(name = \"JEFFERY A\", position = \"SERGEANT\", salary = 101442)A vector can be used to store a table column.[\"JEFFERY A\", \"JAMES A\", \"TERRY A\"]When it comes to the table as a whole, we have a choice: either store it as a vector of tuples, or, alternatively, as a tuple of vectors.  The former leads to a row-oriented format, commonly used in programming and traditional database engines.[(name = \"JEFFERY A\", position = \"SERGEANT\", salary = 101442),\n (name = \"JAMES A\", position = \"FIRE ENGINEER-EMT\", salary = 103350),\n (name = \"TERRY A\", position = \"POLICE OFFICER\", salary = 93354)]Data layout in which values are stored in a set of homogeneous vectors is called a column-oriented format.  It is often used by analytical databases as it is more suitable for processing complex analytical queries.The module DataKnots.Vectors implements necessary data structures to support column-oriented data layout.  In particular, tabular data is represented using TupleVector objects.TupleVector(:name => [\"JEFFERY A\", \"JAMES A\", \"TERRY A\"],\n            :position => [\"SERGEANT\", \"FIRE ENGINEER-EMT\", \"POLICE OFFICER\"],\n            :salary => [101442, 103350, 93354])"
},

{
    "location": "vectors.html#Missing-cells-1",
    "page": "Column Store",
    "title": "Missing cells",
    "category": "section",
    "text": "When we discussed tabular format, we assumed that each table cell contains exactly one value.  But in some cases, to present data in tabular format, we need to leave some cells blank.Continuing with the previous example, consider that an employee could be compensated either with salary or with hourly pay.  To display the compensation data, we use separate columns for annual salary and for hourly rate, but only one the columns per each row is filled.name position salary rate\nJEFFERY A SERGEANT 101442 \nJAMES A FIRE ENGINEER-EMT 103350 \nTERRY A POLICE OFFICER 93354 \nLAKENYA A CROSSING GUARD  17.68How could this data be represented in column-oriented form?  To retain the advantages of the format, we\'d like to keep the data in tightly packed element vectors.[\"JEFFERY A\", \"JAMES A\", \"TERRY A\", \"LAKENYA A\"]\n[\"SERGEANT\", \"FIRE ENGINEER-EMT\", \"POLICE OFFICER\", \"CROSSING GUARD\"]\n[101442, 103350, 93354]\n[17.68]But since the vector indexes no longer correspond to row numbers, we don\'t know how to map vector elements to the table cells.  This mapping could be restored with an offset vector, a vector of indexes in the element vector specifying the boundaries of the respective cells.[1, 2, 3, 4, 5]\n[1, 2, 3, 4, 5]\n[1, 2, 3, 4, 4]\n[1, 1, 1, 1, 2]A BlockVector object encapsulates a pair of the offset and the element vectors.  Here, the symbol : is used as a shortcut for a unit range vector.BlockVector(:, [\"JEFFERY A\", \"JAMES A\", \"TERRY A\", \"LAKENYA A\"])\nBlockVector(:, [\"SERGEANT\", \"FIRE ENGINEER-EMT\", \"POLICE OFFICER\", \"CROSSING GUARD\"])\nBlockVector([1, 2, 3, 4, 4], [101442, 103350, 93354])\nBlockVector([1, 1, 1, 1, 2], [17.68])Now that the correspondence between rows and columns is restored, we could wrap the columns with a TupleVector.TupleVector(\n    :name => BlockVector(:, [\"JEFFERY A\", \"JAMES A\", \"TERRY A\", \"LAKENYA A\"]),\n    :position => BlockVector(:, [\"SERGEANT\", \"FIRE ENGINEER-EMT\", \"POLICE OFFICER\", \"CROSSING GUARD\"]),\n    :salary => BlockVector([1, 2, 3, 4, 4], [101442, 103350, 93354]),\n    :rate => BlockVector([1, 1, 1, 1, 2], [17.68]))"
},

{
    "location": "vectors.html#Nested-data-1",
    "page": "Column Store",
    "title": "Nested data",
    "category": "section",
    "text": ""
},

{
    "location": "vectors.html#Circular-data-1",
    "page": "Column Store",
    "title": "Circular data",
    "category": "section",
    "text": ""
},

{
    "location": "vectors.html#DataKnots.Vectors.TupleVector",
    "page": "Column Store",
    "title": "DataKnots.Vectors.TupleVector",
    "category": "type",
    "text": "TupleVector([lbls::Vector{Symbol}], len::Int, cols::Vector{AbstractVector})\nTupleVector(cols::Pair{Symbol,<:AbstractVector}...)\n\nVector of tuples stored as a collection of column vectors.\n\n\n\n\n\n"
},

{
    "location": "vectors.html#DataKnots.Vectors.BlockVector",
    "page": "Column Store",
    "title": "DataKnots.Vectors.BlockVector",
    "category": "type",
    "text": "BlockVector(offs::AbstractVector{Int}, elts::AbstractVector)\nBlockVector(blks::AbstractVector)\n\nVector of vectors (blocks) stored as a vector of elements partitioned by a vector of offsets.\n\n\n\n\n\n"
},

{
    "location": "vectors.html#DataKnots.Vectors.IndexVector",
    "page": "Column Store",
    "title": "DataKnots.Vectors.IndexVector",
    "category": "type",
    "text": "IndexVector(ident::Symbol, idxs::AbstractVector{Int})\n\nVector of indexes in some named vector.\n\n\n\n\n\n"
},

{
    "location": "vectors.html#DataKnots.Vectors.CapsuleVector",
    "page": "Column Store",
    "title": "DataKnots.Vectors.CapsuleVector",
    "category": "type",
    "text": "CapsuleVector(vals::AbstractVector, refs::Pair{Symbol,<:AbstractVector}...)\n\nEncapsulates reference vectors to dereference any nested indexes.\n\n\n\n\n\n"
},

{
    "location": "vectors.html#API-Reference-1",
    "page": "Column Store",
    "title": "API Reference",
    "category": "section",
    "text": "DataKnots.Vectors.TupleVector\nDataKnots.Vectors.BlockVector\nDataKnots.Vectors.IndexVector\nDataKnots.Vectors.CapsuleVector"
},

{
    "location": "vectors.html#Test-Suite-1",
    "page": "Column Store",
    "title": "Test Suite",
    "category": "section",
    "text": ""
},

{
    "location": "vectors.html#TupleVector-1",
    "page": "Column Store",
    "title": "TupleVector",
    "category": "section",
    "text": "TupleVector is a vector of tuples stored as a collection of parallel vectors.tv = TupleVector(:name => [\"GARRY M\", \"ANTHONY R\", \"DANA A\"],\n                 :salary => [260004, 185364, 170112])\n#-> @VectorTree (name = String, salary = Int) [(name = \"GARRY M\", salary = 260004) … ]\n\ndisplay(tv)\n#=>\nTupleVector of 3 × (name = String, salary = Int):\n (name = \"GARRY M\", salary = 260004)\n (name = \"ANTHONY R\", salary = 185364)\n (name = \"DANA A\", salary = 170112)\n=#It is possible to construct a TupleVector without labels.TupleVector(length(tv), columns(tv))\n#-> @VectorTree (String, Int) [(\"GARRY M\", 260004) … ]An error is reported in case of duplicate labels or columns of different height.TupleVector(:name => [\"GARRY M\", \"ANTHONY R\"],\n            :name => [\"DANA A\", \"JUAN R\"])\n#-> ERROR: duplicate column label :name\n\nTupleVector(:name => [\"GARRY M\", \"ANTHONY R\"],\n            :salary => [260004, 185364, 170112])\n#-> ERROR: unexpected column heightWe can access individual components of the vector.labels(tv)\n#-> Symbol[:name, :salary]\n\nwidth(tv)\n#-> 2\n\ncolumn(tv, 2)\n#-> [260004, 185364, 170112]\n\ncolumn(tv, :salary)\n#-> [260004, 185364, 170112]\n\ncolumns(tv)\n#-> …[[\"GARRY M\", \"ANTHONY R\", \"DANA A\"], [260004, 185364, 170112]]When indexed by another vector, we get a new instance of TupleVector.tv′ = tv[[3,1]]\ndisplay(tv′)\n#=>\nTupleVector of 2 × (name = String, salary = Int):\n (name = \"DANA A\", salary = 170112)\n (name = \"GARRY M\", salary = 260004)\n=#Note that the new instance keeps a reference to the index and the original column vectors.  Updated column vectors are generated on demand.column(tv′, 2)\n#-> [170112, 260004]"
},

{
    "location": "vectors.html#BlockVector-1",
    "page": "Column Store",
    "title": "BlockVector",
    "category": "section",
    "text": "BlockVector is a vector of homogeneous vectors (blocks) stored as a vector of elements partitioned into individual blocks by a vector of offsets.bv = BlockVector([[\"HEALTH\"], [\"FINANCE\", \"HUMAN RESOURCES\"], [], [\"POLICE\", \"FIRE\"]])\n#-> @VectorTree [String] [\"HEALTH\", [\"FINANCE\", \"HUMAN RESOURCES\"], missing, [\"POLICE\", \"FIRE\"]]\n\ndisplay(bv)\n#=>\nBlockVector of 4 × [String]:\n \"HEALTH\"\n [\"FINANCE\", \"HUMAN RESOURCES\"]\n missing\n [\"POLICE\", \"FIRE\"]\n=#We can omit brackets for singular blocks and use missing in place of empty blocks.BlockVector([\"HEALTH\", [\"FINANCE\", \"HUMAN RESOURCES\"], missing, [\"POLICE\", \"FIRE\"]])\n#-> @VectorTree [String] [\"HEALTH\", [\"FINANCE\", \"HUMAN RESOURCES\"], missing, [\"POLICE\", \"FIRE\"]]It is possible to specify the offset and the element vectors separately.BlockVector([1, 2, 4, 4, 6], [\"HEALTH\", \"FINANCE\", \"HUMAN RESOURCES\", \"POLICE\", \"FIRE\"])\n#-> @VectorTree [String] [\"HEALTH\", [\"FINANCE\", \"HUMAN RESOURCES\"], missing, [\"POLICE\", \"FIRE\"]]If each block contains exactly one element, we could use : in place of the offset vector.BlockVector(:, [\"HEALTH\", \"FINANCE\", \"HUMAN RESOURCES\", \"POLICE\", \"FIRE\"])\n#-> @VectorTree [String] [\"HEALTH\", \"FINANCE\", \"HUMAN RESOURCES\", \"POLICE\", \"FIRE\"]The BlockVector constructor verifies that the offset vector is well-formed.BlockVector(Base.OneTo(0), [])\n#-> ERROR: partition must be non-empty\n\nBlockVector(Int[], [])\n#-> ERROR: partition must be non-empty\n\nBlockVector([0], [])\n#-> ERROR: partition must start with 1\n\nBlockVector([1,2,2,1], [\"HEALTH\"])\n#-> ERROR: partition must be monotone\n\nBlockVector(Base.OneTo(4), [\"HEALTH\", \"FINANCE\"])\n#-> ERROR: partition must enclose the elements\n\nBlockVector([1,2,3,6], [\"HEALTH\", \"FINANCE\"])\n#-> ERROR: partition must enclose the elementsWe can access individual components of the vector.offsets(bv)\n#-> [1, 2, 4, 4, 6]\n\nelements(bv)\n#-> [\"HEALTH\", \"FINANCE\", \"HUMAN RESOURCES\", \"POLICE\", \"FIRE\"]\n\npartition(bv)\n#-> ([1, 2, 4, 4, 6], [\"HEALTH\", \"FINANCE\", \"HUMAN RESOURCES\", \"POLICE\", \"FIRE\"])When indexed by a vector of indexes, an instance of BlockVector is returned.elts = [\"POLICE\", \"FIRE\", \"HEALTH\", \"AVIATION\", \"WATER MGMNT\", \"FINANCE\"]\n\nreg_bv = BlockVector(:, elts)\n#-> @VectorTree [String] [\"POLICE\", \"FIRE\", \"HEALTH\", \"AVIATION\", \"WATER MGMNT\", \"FINANCE\"]\n\nopt_bv = BlockVector([1, 2, 3, 3, 4, 4, 5, 6, 6, 6, 7], elts)\n#-> @VectorTree [String] [\"POLICE\", \"FIRE\", missing, \"HEALTH\", missing, \"AVIATION\", \"WATER MGMNT\", missing, missing, \"FINANCE\"]\n\nplu_bv = BlockVector([1, 1, 1, 2, 2, 4, 4, 6, 7], elts)\n#-> @VectorTree [String] [missing, missing, \"POLICE\", missing, [\"FIRE\", \"HEALTH\"], missing, [\"AVIATION\", \"WATER MGMNT\"], \"FINANCE\"]\n\nreg_bv[[1,3,5,3]]\n#-> @VectorTree [String] [\"POLICE\", \"HEALTH\", \"WATER MGMNT\", \"HEALTH\"]\n\nplu_bv[[1,3,5,3]]\n#-> @VectorTree [String] [missing, \"POLICE\", [\"FIRE\", \"HEALTH\"], \"POLICE\"]\n\nreg_bv[Base.OneTo(4)]\n#-> @VectorTree [String] [\"POLICE\", \"FIRE\", \"HEALTH\", \"AVIATION\"]\n\nreg_bv[Base.OneTo(6)]\n#-> @VectorTree [String] [\"POLICE\", \"FIRE\", \"HEALTH\", \"AVIATION\", \"WATER MGMNT\", \"FINANCE\"]\n\nplu_bv[Base.OneTo(6)]\n#-> @VectorTree [String] [missing, missing, \"POLICE\", missing, [\"FIRE\", \"HEALTH\"], missing]\n\nopt_bv[Base.OneTo(10)]\n#-> @VectorTree [String] [\"POLICE\", \"FIRE\", missing, \"HEALTH\", missing, \"AVIATION\", \"WATER MGMNT\", missing, missing, \"FINANCE\"]"
},

{
    "location": "vectors.html#IndexVector-1",
    "page": "Column Store",
    "title": "IndexVector",
    "category": "section",
    "text": "IndexVector is a vector of indexes in some named vector.iv = IndexVector(:REF, [1, 1, 1, 2])\n#-> @VectorTree &REF [1, 1, 1, 2]\n\ndisplay(iv)\n#=>\nIndexVector of 4 × &REF:\n 1\n 1\n 1\n 2\n=#We can obtain the components of the vector.identifier(iv)\n#-> :REF\n\nindexes(iv)\n#-> [1, 1, 1, 2]Indexing an IndexVector by a vector produces another IndexVector instance.iv[[4,2]]\n#-> @VectorTree &REF [2, 1]IndexVector can be deferenced against a list of named vectors.refv = [\"COMISSIONER\", \"DEPUTY COMISSIONER\", \"ZONING ADMINISTRATOR\", \"PROJECT MANAGER\"]\n\ndereference(iv, [:REF => refv])\n#-> [\"COMISSIONER\", \"COMISSIONER\", \"COMISSIONER\", \"DEPUTY COMISSIONER\"]Function dereference() has no effect on other types of vectors, or when the desired reference vector is not in the list.dereference(iv, [:REF′ => refv])\n#-> @VectorTree &REF [1, 1, 1, 2]\n\ndereference([1, 1, 1, 2], [:REF => refv])\n#-> [1, 1, 1, 2]"
},

{
    "location": "vectors.html#CapsuleVector-1",
    "page": "Column Store",
    "title": "CapsuleVector",
    "category": "section",
    "text": "CapsuleVector provides references for a composite vector with nested indexes. We use CapsuleVector to represent self-referential and mutually referential data.cv = CapsuleVector(TupleVector(:ref => iv), :REF => refv)\n#-> @VectorTree (ref = &REF,) [(ref = 1,), (ref = 1,), (ref = 1,), (ref = 2,)] where {REF = [ … ]}\n\ndisplay(cv)\n#=>\nCapsuleVector of 4 × (ref = &REF,):\n (ref = 1,)\n (ref = 1,)\n (ref = 1,)\n (ref = 2,)\nwhere\n REF = [\"COMISSIONER\", \"DEPUTY COMISSIONER\" … ]\n=#Function decapsulate() decomposes a capsule into the underlying vector and a list of references.decapsulate(cv)\n#-> (@VectorTree (ref = &REF,) [ … ], Pair{Symbol,AbstractArray{T,1} where T}[ … ])Function recapsulate() applies the given function to the underlying vector and encapsulates the output of the function.cv′ = recapsulate(v -> v[:, :ref], cv)\n#-> @VectorTree &REF [1, 1, 1, 2] where {REF = [ … ]}We could dereference CapsuleVector if it wraps an IndexVector instance. Function dereference() has no effect otherwise.dereference(cv′)\n#-> [\"COMISSIONER\", \"COMISSIONER\", \"COMISSIONER\", \"DEPUTY COMISSIONER\"]\n\ndereference(cv)\n#-> @VectorTree (ref = &REF,) [(ref = 1,), (ref = 1,), (ref = 1,), (ref = 2,)] where {REF = [ … ]}Indexing CapsuleVector by a vector produces another instance of CapsuleVector.cv[[4,2]]\n#-> @VectorTree (ref = &REF,) [(ref = 2,), (ref = 1,)] where {REF = [ … ]}"
},

{
    "location": "vectors.html#@VectorTree-1",
    "page": "Column Store",
    "title": "@VectorTree",
    "category": "section",
    "text": "We can use @VectorTree macro to convert vector literals to the columnar form assembled with TupleVector, BlockVector, IndexVector, and CapsuleVector.TupleVector is created from a matrix or a vector of (named) tuples.@VectorTree (name = String, salary = Int) [\n    \"GARRY M\"   260004\n    \"ANTHONY R\" 185364\n    \"DANA A\"    170112\n]\n#-> @VectorTree (name = String, salary = Int) [(name = \"GARRY M\", salary = 260004) … ]\n\n@VectorTree (name = String, salary = Int) [\n    (\"GARRY M\", 260004),\n    (\"ANTHONY R\", 185364),\n    (\"DANA A\", 170112),\n]\n#-> @VectorTree (name = String, salary = Int) [(name = \"GARRY M\", salary = 260004) … ]\n\n@VectorTree (name = String, salary = Int) [\n    (name = \"GARRY M\", salary = 260004),\n    (name = \"ANTHONY R\", salary = 185364),\n    (name = \"DANA A\", salary = 170112),\n]\n#-> @VectorTree (name = String, salary = Int) [(name = \"GARRY M\", salary = 260004) … ]Column labels are optional.@VectorTree (String, Int) [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112]\n#-> @VectorTree (String, Int) [(\"GARRY M\", 260004) … ]BlockVector and IndexVector can also be constructed.@VectorTree [String] [\n    \"HEALTH\",\n    [\"FINANCE\", \"HUMAN RESOURCES\"],\n    missing,\n    [\"POLICE\", \"FIRE\"],\n]\n#-> @VectorTree [String] [\"HEALTH\", [\"FINANCE\", \"HUMAN RESOURCES\"], missing, [\"POLICE\", \"FIRE\"]]\n\n@VectorTree &REF [1, 1, 1, 2]\n#-> @VectorTree &REF [1, 1, 1, 2]A CapsuleVector could be constructed using where syntax.@VectorTree &REF [1, 1, 1, 2] where {REF = refv}\n#-> @VectorTree &REF [1, 1, 1, 2] where {REF = [\"COMISSIONER\", \"DEPUTY COMISSIONER\"  … ]}Ill-formed @VectorTree contructors are rejected.@VectorTree (String, Int) (\"GARRY M\", 260004)\n#=>\nERROR: LoadError: expected a vector literal; got :((\"GARRY M\", 260004))\n⋮\n=#\n\n@VectorTree (String, Int) [(position = \"SUPERINTENDENT OF POLICE\", salary = 260004)]\n#=>\nERROR: LoadError: expected no label; got :(position = \"SUPERINTENDENT OF POLICE\")\n⋮\n=#\n\n@VectorTree (name = String, salary = Int) [(position = \"SUPERINTENDENT OF POLICE\", salary = 260004)]\n#=>\nERROR: LoadError: expected label :name; got :(position = \"SUPERINTENDENT OF POLICE\")\n⋮\n=#\n\n@VectorTree (name = String, salary = Int) [(\"GARRY M\", \"SUPERINTENDENT OF POLICE\", 260004)]\n#=>\nERROR: LoadError: expected 2 column(s); got :((\"GARRY M\", \"SUPERINTENDENT OF POLICE\", 260004))\n⋮\n=#\n\n@VectorTree (name = String, salary = Int) [\"GARRY M\"]\n#=>\nERROR: LoadError: expected a tuple or a row literal; got \"GARRY M\"\n⋮\n=#\n\n@VectorTree &REF [[]] where (:REF => [])\n#=>\nERROR: LoadError: expected an assignment; got :(:REF => [])\n⋮\n=#Using @VectorTree, we can easily construct hierarchical and mutually referential data.hier_data = @VectorTree (name = [String], employee = [(name = [String], salary = [Int])]) [\n    \"POLICE\"    [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112]\n    \"FIRE\"      [\"JOSE S\" 202728; \"CHARLES S\" 197736]\n]\ndisplay(hier_data)\n#=>\nTupleVector of 2 × (name = [String], employee = [(name = [String], salary = [Int])]):\n (name = \"POLICE\", employee = [(name = \"GARRY M\", salary = 260004) … ])\n (name = \"FIRE\", employee = [(name = \"JOSE S\", salary = 202728) … ])\n=#\n\nmref_data = @VectorTree (department = [&DEPT], employee = [&EMP]) [\n    [1, 2]  [1, 2, 3, 4, 5]\n] where {\n    DEPT = @VectorTree (name = [String], employee = [&EMP]) [\n        \"POLICE\"    [1, 2, 3]\n        \"FIRE\"      [4, 5]\n    ]\n    ,\n    EMP = @VectorTree (name = [String], department = [&DEPT], salary = [Int]) [\n        \"GARRY M\"   1   260004\n        \"ANTHONY R\" 1   185364\n        \"DANA A\"    1   170112\n        \"JOSE S\"    2   202728\n        \"CHARLES S\" 2   197736\n    ]\n}\ndisplay(mref_data)\n#=>\nCapsuleVector of 1 × (department = [&DEPT], employee = [&EMP]):\n (department = [1, 2], employee = [1, 2, 3, 4, 5])\nwhere\n DEPT = @VectorTree (name = [String], employee = [&EMP]) [(name = \"POLICE\", employee = [1, 2, 3]) … ]\n EMP = @VectorTree (name = [String], department = [&DEPT], salary = [Int]) [(name = \"GARRY M\", department = 1, salary = 260004) … ]\n=#"
},

{
    "location": "shapes.html#",
    "page": "Type System",
    "title": "Type System",
    "category": "page",
    "text": ""
},

{
    "location": "shapes.html#Type-System-1",
    "page": "Type System",
    "title": "Type System",
    "category": "section",
    "text": "This module lets us describe the shape of the data.using DataKnots.Shapes"
},

{
    "location": "shapes.html#Cardinality-1",
    "page": "Type System",
    "title": "Cardinality",
    "category": "section",
    "text": "Enumerated type Cardinality is used to constrain the cardinality of a data block.  A block of data is called regular if it must contain exactly one element; optional if it may have no elements; and plural if it may have more than one element.  This gives us four different cardinality constraints.display(Cardinality)\n#=>\nEnum Cardinality:\nREG = 0\nOPT = 1\nPLU = 2\nOPT|PLU = 3\n=#Cardinality values support bitwise operations.REG|OPT|PLU             #-> OPT|PLU\nPLU&~PLU                #-> REGWe can use predicates isregular(), isoptional(), isplural() to check cardinality values.isregular(REG)          #-> true\nisregular(OPT)          #-> false\nisregular(PLU)          #-> false\nisoptional(OPT)         #-> true\nisoptional(PLU)         #-> false\nisplural(PLU)           #-> true\nisplural(OPT)           #-> falseCardinality supports standard operations on enumerated types.typemin(Cardinality)    #-> REG\ntypemax(Cardinality)    #-> OPT|PLU\nREG < OPT|PLU           #-> true\n\nCardinality(3)\n#-> OPT|PLU\nread(IOBuffer(\"\\x03\"), Cardinality)\n#-> OPT|PLUThere is a partial ordering defined on Cardinality values.  We can determine the greatest and the least cardinality; the least upper bound and the greatest lower bound of a collection of Cardinality values; and, for two Cardinality values, determine whether one of the values is smaller than the other.bound(Cardinality)      #-> REG\nibound(Cardinality)     #-> OPT|PLU\n\nbound(OPT, PLU)         #-> OPT|PLU\nibound(PLU, OPT)        #-> REG\n\nfits(OPT, PLU)          #-> false\nfits(REG, OPT|PLU)      #-> true"
},

{
    "location": "shapes.html#Data-shapes-1",
    "page": "Type System",
    "title": "Data shapes",
    "category": "section",
    "text": "The structure of composite data is specified with shape objects.NativeShape specifies the type of a regular Julia value.str_shp = NativeShape(String)\n#-> NativeShape(String)\n\neltype(str_shp)\n#-> StringClassShape refers to a shape with a name.cls_shp = ClassShape(:Emp)\n#-> ClassShape(:Emp)\n\nclass(cls_shp)\n#-> :EmpWe can provide a definition for a class name using rebind() method.clos_shp = cls_shp |> rebind(:Emp => str_shp)\n#-> ClassShape(:Emp) |> rebind(:Emp => NativeShape(String))Now we can obtain the actual shape of the class.clos_shp[]\n#-> NativeShape(String)A shape which does not contain any nested undefined classes is called closed.isclosed(str_shp)\n#-> true\n\nisclosed(cls_shp)\n#-> false\n\nisclosed(clos_shp)\n#-> trueTupleShape lets us specify the field types of a tuple value.tpl_shp = TupleShape(NativeShape(String),\n                     BlockShape(ClassShape(:Emp)))\n#-> TupleShape(NativeShape(String), BlockShape(ClassShape(:Emp)))\n\nforeach(println, tpl_shp[:])\n#=>\nNativeShape(String)\nBlockShape(ClassShape(:Emp))\n=#Two special shape types are used to indicate that the value may have any shape, or cannot exist.any_shp = AnyShape()\n#-> AnyShape()\n\nnone_shp = NoneShape()\n#-> NoneShape()To any shape, we can attach an arbitrary set of attributes, which are called decorations.  In particular, we can label the values.decor_shp = str_shp |> decorate(:tag => :position)\n#-> NativeShape(String) |> decorate(:tag => :position)The value of a decoration could be extracted.decoration(decor_shp, :tag)We can enforce the type and the default value of the decoration.decoration(decor_shp, :tag, Symbol, Symbol(\"\"))\n#-> :position\ndecoration(decor_shp, :tag, String, \"\")\n#-> \"\"\ndecoration(str_shp, :tag, String, \"\")\n#-> \"\"InputShape and OutputShape are derived shapes that describe the structure of the query input and the query output.To describe the query input, we specify the shape of the input elements, the shapes of the parameters, and whether or not the input is framed.i_shp = InputShape(ClassShape(:Emp),\n                   [:D => OutputShape(NativeShape(String))],\n                   true)\n#-> InputShape(ClassShape(:Emp), [:D => OutputShape(NativeShape(String))], true)\n\ni_shp[]\n#-> ClassShape(:Emp)\n\ndomain(i_shp)\n#-> ClassShape(:Emp)\n\nmode(i_shp)\n#-> InputMode([:D => OutputShape(NativeShape(String))], true)To describe the query output, we specify the shape and the cardinality of the output elements.o_shp = OutputShape(NativeShape(Int), OPT|PLU)\n#-> OutputShape(NativeShape(Int), OPT|PLU)\n\no_shp[]\n#-> NativeShape(Int)\n\ncardinality(o_shp)\n#-> OPT|PLU\n\ndomain(o_shp)\n#-> NativeShape(Int)\n\nmode(o_shp)\n#-> OutputMode(OPT|PLU)RecordShape` specifies the shape of a record value where each field has a certain shape and cardinality.dept_shp = RecordShape(OutputShape(String) |> decorate(:tag => :name),\n                       OutputShape(:Emp, OPT|PLU) |> decorate(:tag => :employee))\n#=>\nRecordShape(OutputShape(NativeShape(String) |> decorate(:tag => :name)),\n            OutputShape(ClassShape(:Emp) |> decorate(:tag => :employee),\n                        OPT|PLU))\n=#\n\nemp_shp = RecordShape(OutputShape(String) |> decorate(:tag => :name),\n                      OutputShape(:Dept) |> decorate(:tag => :department),\n                      OutputShape(String) |> decorate(:tag => :position),\n                      OutputShape(Int) |> decorate(:tag => :salary),\n                      OutputShape(:Emp, OPT) |> decorate(:tag => :manager),\n                      OutputShape(:Emp, OPT|PLU) |> decorate(:tag => :subordinate))\n#=>\nRecordShape(OutputShape(NativeShape(String) |> decorate(:tag => :name)),\n            OutputShape(ClassShape(:Dept) |> decorate(:tag => :department)),\n            OutputShape(NativeShape(String) |> decorate(:tag => :position)),\n            OutputShape(NativeShape(Int) |> decorate(:tag => :salary)),\n            OutputShape(ClassShape(:Emp) |> decorate(:tag => :manager), OPT),\n            OutputShape(ClassShape(:Emp) |> decorate(:tag => :subordinate),\n                        OPT|PLU))\n=#Using the combination of different shapes we can describe the structure of any data source.db_shp = RecordShape(OutputShape(:Dept, OPT|PLU) |> decorate(:tag => :department),\n                     OutputShape(:Emp, OPT|PLU) |> decorate(:tag => :employee))\n\ndb_shp |> rebind(:Dept => dept_shp, :Emp => emp_shp)\n#=>\nRecordShape(\n    OutputShape(\n        ClassShape(:Dept)\n        |> rebind(:Dept => RecordShape(\n                               OutputShape(NativeShape(String)\n                                           |> decorate(:tag => :name)),\n                               OutputShape(ClassShape(:Emp)\n                                           |> decorate(:tag => :employee),\n                                           OPT|PLU))\n                           |> decorate(:tag => :department),\n                  :Emp => RecordShape(\n                              OutputShape(NativeShape(String)\n                                          |> decorate(:tag => :name)),\n                              ⋮\n                              OutputShape(ClassShape(:Emp)\n                                          |> decorate(:tag => :subordinate),\n                                          OPT|PLU))),\n        OPT|PLU),\n    OutputShape(\n        ClassShape(:Emp)\n        |> rebind(:Dept => RecordShape(\n                               OutputShape(NativeShape(String)\n                                           |> decorate(:tag => :name)),\n                               OutputShape(ClassShape(:Emp)\n                                           |> decorate(:tag => :employee),\n                                           OPT|PLU)),\n                  :Emp => RecordShape(\n                              OutputShape(NativeShape(String)\n                                          |> decorate(:tag => :name)),\n                              ⋮\n                              OutputShape(ClassShape(:Emp)\n                                          |> decorate(:tag => :subordinate),\n                                          OPT|PLU))\n                          |> decorate(:tag => :employee)),\n        OPT|PLU))\n=#"
},

{
    "location": "shapes.html#Shape-ordering-1",
    "page": "Type System",
    "title": "Shape ordering",
    "category": "section",
    "text": "The same data can satisfy many different shape constraints.  For example, a vector BlockVector([Chicago]) can be said to have, among others, the shape BlockShape(String), the shape OutputShape(String, OPT|PLU) or the shape AnyShape().  We can tell, for any two shapes, if one of them is more specific than the other.fits(NativeShape(Int), NativeShape(Number))     #-> true\nfits(NativeShape(Int), NativeShape(String))     #-> false\n\nfits(ClassShape(:Emp), ClassShape(:Emp))        #-> true\nfits(ClassShape(:Emp), ClassShape(:Dept))       #-> false\n\nfits(ClassShape(:Emp),\n     ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)))    #-> false\n\nfits(ClassShape(:Emp),\n     ClassShape(:Dept)\n     |> rebind(:Emp => NativeShape(String)))    #-> false\n\nfits(ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)),\n     ClassShape(:Emp))                          #-> true\n\nfits(ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)),\n     ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)))    #-> true\n\nfits(ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)),\n     ClassShape(:Dept)\n     |> rebind(:Dept => NativeShape(String)))   #-> false\n\nfits(ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(String)),\n     ClassShape(:Emp)\n     |> rebind(:Emp => NativeShape(Number)))    #-> false\n\nfits(BlockShape(Int), BlockShape(Number))       #-> true\nfits(BlockShape(Int), BlockShape(String))       #-> false\n\nfits(TupleShape(Int, BlockShape(String)),\n     TupleShape(Number, BlockShape(String)))    #-> true\nfits(TupleShape(Int, BlockShape(String)),\n     TupleShape(String, BlockShape(String)))    #-> false\nfits(TupleShape(Int),\n     TupleShape(Number, BlockShape(String)))    #-> false\n\nfits(InputShape(Int,\n                [:X => OutputShape(Int),\n                 :Y => OutputShape(String)],\n                true),\n     InputShape(Number,\n                [:X => OutputShape(Int, OPT)])) #-> true\nfits(InputShape(Int),\n     InputShape(Number, true))                  #-> false\nfits(InputShape(Int,\n                [:X => OutputShape(Int, OPT)]),\n     InputShape(Number,\n                [:X => OutputShape(Int)]))      #-> false\n\nfits(OutputShape(Int),\n     OutputShape(Number, OPT))                  #-> true\nfits(OutputShape(Int, PLU),\n     OutputShape(Number, OPT))                  #-> false\nfits(OutputShape(Int),\n     OutputShape(String, OPT))                  #-> false\n\nfits(RecordShape(OutputShape(Int),\n                 OutputShape(String, OPT)),\n     RecordShape(OutputShape(Number),\n                 OutputShape(String, OPT|PLU)))     #-> true\nfits(RecordShape(OutputShape(Int, OPT),\n                 OutputShape(String)),\n     RecordShape(OutputShape(Number),\n                 OutputShape(String, OPT|PLU)))     #-> false\nfits(RecordShape(OutputShape(Int)),\n     RecordShape(OutputShape(Number),\n                 OutputShape(String, OPT|PLU)))     #-> falseShapes of different kinds are typically not compatible with each other.  The exceptions are AnyShape and NullShape.fits(NativeShape(Int), ClassShape(:Emp))    #-> false\nfits(NativeShape(Int), AnyShape())          #-> true\nfits(NoneShape(), ClassShape(:Emp))         #-> trueShape decorations are treated as additional shape constraints.fits(NativeShape(String) |> decorate(:tag => :name),\n     NativeShape(String) |> decorate(:tag => :name))        #-> true\nfits(NativeShape(String),\n     NativeShape(String) |> decorate(:tag => :name))        #-> false\nfits(NativeShape(String) |> decorate(:tag => :position),\n     NativeShape(String))                                   #-> true\nfits(NativeShape(String) |> decorate(:tag => :position),\n     NativeShape(String) |> decorate(:tag => :name))        #-> falseFor any given number of shapes, we can find their upper bound, the shape that is more general than each of them.  We can also find their lower bound.bound(NativeShape(Int), NativeShape(Number))\n#-> NativeShape(Number)\nibound(NativeShape(Int), NativeShape(Number))\n#-> NativeShape(Int)\n\nbound(ClassShape(:Emp), ClassShape(:Emp))\n#-> ClassShape(:Emp)\nibound(ClassShape(:Emp), ClassShape(:Emp))\n#-> ClassShape(:Emp)\nbound(ClassShape(:Emp), ClassShape(:Dept))\n#-> AnyShape()\nibound(ClassShape(:Emp), ClassShape(:Dept))\n#-> NoneShape()\nbound(ClassShape(:Emp),\n      ClassShape(:Emp) |> rebind(:Emp => NativeShape(String)))\n#-> ClassShape(:Emp)\nibound(ClassShape(:Emp),\n       ClassShape(:Emp) |> rebind(:Emp => NativeShape(String)))\n#-> ClassShape(:Emp) |> rebind(:Emp => NativeShape(String))\nbound(ClassShape(:Emp) |> rebind(:Emp => NativeShape(Number)),\n      ClassShape(:Emp) |> rebind(:Emp => NativeShape(String)))\n#-> ClassShape(:Emp) |> rebind(:Emp => AnyShape())\nibound(ClassShape(:Emp) |> rebind(:Emp => NativeShape(Number)),\n       ClassShape(:Emp) |> rebind(:Emp => NativeShape(String)))\n#-> ClassShape(:Emp) |> rebind(:Emp => NoneShape())\n\nbound(BlockShape(Int), BlockShape(Number))\n#-> BlockShape(NativeShape(Number))\nibound(BlockShape(Int), BlockShape(Number))\n#-> BlockShape(NativeShape(Int))\n\nbound(TupleShape(:Emp, BlockShape(String)),\n      TupleShape(:Dept, BlockShape(String)))\n#-> TupleShape(AnyShape(), BlockShape(NativeShape(String)))\nibound(TupleShape(:Emp, BlockShape(String)),\n       TupleShape(:Dept, BlockShape(String)))\n#-> TupleShape(NoneShape(), BlockShape(NativeShape(String)))\n\nbound(InputShape(Int, [:X => OutputShape(Int, OPT), :Y => OutputShape(String)], true),\n      InputShape(Number, [:X => OutputShape(Int)]))\n#=>\nInputShape(NativeShape(Number), [:X => OutputShape(NativeShape(Int), OPT)])\n=#\nibound(InputShape(Int, [:X => OutputShape(Int, OPT), :Y => OutputShape(String)], true),\n       InputShape(Number, [:X => OutputShape(Int)]))\n#=>\nInputShape(NativeShape(Int),\n           [:X => OutputShape(NativeShape(Int)),\n            :Y => OutputShape(NativeShape(String))],\n           true)\n=#\n\nbound(OutputShape(String, OPT), OutputShape(String, PLU))\n#-> OutputShape(NativeShape(String), OPT|PLU)\nibound(OutputShape(String, OPT), OutputShape(String, PLU))\n#-> OutputShape(NativeShape(String))\n\nbound(RecordShape(OutputShape(Int, PLU),\n                  OutputShape(String, OPT)),\n      RecordShape(OutputShape(Number),\n                  OutputShape(:Emp, OPT|PLU)))\n#=>\nRecordShape(OutputShape(NativeShape(Number), PLU),\n            OutputShape(AnyShape(), OPT|PLU))\n=#\nibound(RecordShape(OutputShape(Int, PLU),\n                   OutputShape(String, OPT)),\n       RecordShape(OutputShape(Number),\n                   OutputShape(:Emp, OPT|PLU)))\n#=>\nRecordShape(OutputShape(NativeShape(Int)), OutputShape(NoneShape(), OPT))\n=#For decorated shapes, incompatible decoration constraints are replaced with nothing.bound(NativeShape(String) |> decorate(:show => false, :tag => :name),\n      NativeShape(String) |> decorate(:hide => true, :tag => :name))\n#-> NativeShape(String) |> decorate(:tag => :name)\n\nibound(NativeShape(String) |> decorate(:show => false, :tag => :name),\n       NativeShape(String) |> decorate(:hide => true, :tag => :name))\n#-> NativeShape(String) |> decorate(:hide => true, :show => false, :tag => :name)\n\nbound(NativeShape(String) |> decorate(:tag => :position),\n      NativeShape(Number) |> decorate(:tag => :salary))\n#-> AnyShape()\n\nibound(NativeShape(String) |> decorate(:tag => :position),\n       NativeShape(Number) |> decorate(:tag => :salary))\n#-> NoneShape() |> decorate(:tag => nothing)\n\nbound(NativeShape(Int),\n      NativeShape(Number) |> decorate(:tag => :salary))\n#-> NativeShape(Number)\n\nibound(NativeShape(Int),\n       NativeShape(Number) |> decorate(:tag => :salary))\n#-> NativeShape(Int) |> decorate(:tag => :salary)"
},

{
    "location": "shapes.html#Query-signature-1",
    "page": "Type System",
    "title": "Query signature",
    "category": "section",
    "text": "The signature of a query is a pair of an InputShape object and an OutputShape object.sig = Signature(InputShape(:Dept),\n                OutputShape(RecordShape(OutputShape(String) |> decorate(:tag => :name),\n                                        OutputShape(:Emp, OPT|PLU) |> decorate(:tag => :employee))))\n#-> Dept -> (name => String[1 .. 1], employee => Emp[0 .. ∞])[1 .. 1]Different components of the signature can be easily extracted.shape(sig)\n#=>\nOutputShape(RecordShape(\n                OutputShape(NativeShape(String) |> decorate(:tag => :name)),\n                OutputShape(ClassShape(:Emp) |> decorate(:tag => :employee),\n                            OPT|PLU)))\n=#\n\nishape(sig)\n#-> InputShape(ClassShape(:Dept))\n\ndomain(sig)\n#=>\nRecordShape(OutputShape(NativeShape(String) |> decorate(:tag => :name)),\n            OutputShape(ClassShape(:Emp) |> decorate(:tag => :employee),\n                        OPT|PLU))\n=#\n\nmode(sig)\n#-> OutputMode()\n\nidomain(sig)\n#-> ClassShape(:Dept)\n\nimode(sig)\n#-> InputMode()"
},

{
    "location": "queries.html#",
    "page": "Query Backend",
    "title": "Query Backend",
    "category": "page",
    "text": ""
},

{
    "location": "queries.html#Query-Backend-1",
    "page": "Query Backend",
    "title": "Query Backend",
    "category": "section",
    "text": "The Queries module contains primitive operations and combinators for transforming atomic and composite vectors.using DataKnots.Vectors\nusing DataKnots.Queries"
},

{
    "location": "queries.html#Lifting-1",
    "page": "Query Backend",
    "title": "Lifting",
    "category": "section",
    "text": "Many vector operations can be generated by lifting.  For example, lift_const() generates a primitive operation that maps any input vector to the output vector of the same length filled with the given value.q = lift_const(200000)\n#-> lift_const(200000)\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> [200000, 200000, 200000]Similarly, the output of lift_block() is a block vector filled with the given block.q = lift_block([\"POLICE\", \"FIRE\"])\n#-> lift_block([\"POLICE\", \"FIRE\"])\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> @VectorTree [String] [[\"POLICE\", \"FIRE\"], [\"POLICE\", \"FIRE\"], [\"POLICE\", \"FIRE\"]]A variant of lift_block() called lift_null() outputs a block vector with empty blocks.q = lift_null()\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> @VectorTree [Union{}] [missing, missing, missing]Any scalar function could be lifted to a vector operation by applying it to each element of the input vector.q = lift(titlecase)\n#-> lift(titlecase)\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> [\"Garry M\", \"Anthony R\", \"Dana A\"]Similarly, any scalar function of several arguments could be lifted to an operation on tuple vectors.q = lift_to_tuple(>)\n#-> lift_to_tuple(>)\n\nq(@VectorTree (Int, Int) [260004 200000; 185364 200000; 170112 200000])\n#-> Bool[true, false, false]It is also possible to apply a scalar function of several arguments to a tuple vector that has block vectors for its columns.  In this case, the function is applied to every combination of values from all the blocks on the same row.q = lift_to_block_tuple(>)\n\nq(@VectorTree ([Int], [Int]) [[260004, 185364, 170112] 200000; missing 200000; [202728, 197736] [200000, 200000]])\n#-> @VectorTree [Bool] [Bool[true, false, false], missing, Bool[true, true, false, false]]Any function that takes a vector argument can be lifted to an operation on block vectors.q = lift_to_block(length)\n#-> lift_to_block(length)\n\nq(@VectorTree [String] [[\"GARRY M\", \"ANTHONY R\", \"DANA A\"], [\"JOSE S\", \"CHARLES S\"]])\n#-> [3, 2]Some vector functions may expect a non-empty vector as an argument.  In this case, we should provide the value to replace empty blocks.q = lift_to_block(maximum, missing)\n#-> lift_to_block(maximum, missing)\n\nq(@VectorTree [Int] [[260004, 185364, 170112], [], [202728, 197736]])\n#-> Union{Missing, Int}[260004, missing, 202728]"
},

{
    "location": "queries.html#Decoding-vectors-1",
    "page": "Query Backend",
    "title": "Decoding vectors",
    "category": "section",
    "text": "Any vector of tuples can be converted to a tuple vector.q = decode_tuple()\n#-> decode_tuple()\n\nq([(\"GARRY M\", 260004), (\"ANTHONY R\", 185364), (\"DANA A\", 170112)]) |> display\n#=>\nTupleVector of 3 × (String, Int):\n (\"GARRY M\", 260004)\n (\"ANTHONY R\", 185364)\n (\"DANA A\", 170112)\n=#Vectors of named tuples are also supported.q([(name=\"GARRY M\", salary=260004), (name=\"ANTHONY R\", salary=185364), (name=\"DANA A\", salary=170112)]) |> display\n#=>\nTupleVector of 3 × (name = String, salary = Int):\n (name = \"GARRY M\", salary = 260004)\n (name = \"ANTHONY R\", salary = 185364)\n (name = \"DANA A\", salary = 170112)\n=#A vector of vector objects can be converted to a block vector.q = decode_vector()\n#-> decode_vector()\n\nq([[260004, 185364, 170112], Int[], [202728, 197736]])\n#-> @VectorTree [Int] [[260004, 185364, 170112], missing, [202728, 197736]]Similarly, a vector containing missing values can be converted to a block vector with zero- and one-element blocks.q = decode_missing()\n#-> decode_missing()\n\nq([260004, 185364, 170112, missing, 202728, 197736])\n#-> @VectorTree [Int] [260004, 185364, 170112, missing, 202728, 197736]"
},

{
    "location": "queries.html#Tuple-vectors-1",
    "page": "Query Backend",
    "title": "Tuple vectors",
    "category": "section",
    "text": "To create a tuple vector, we use the combinator tuple_of(). Its arguments are the functions that generate the columns of the tuple.q = tuple_of(:title => lift(titlecase), :last => lift(last))\n#-> tuple_of([:title, :last], [lift(titlecase), lift(last)])\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"]) |> display\n#=>\nTupleVector of 3 × (title = String, last = Char):\n (title = \"Garry M\", last = \'M\')\n (title = \"Anthony R\", last = \'R\')\n (title = \"Dana A\", last = \'A\')\n=#To extract a column of a tuple vector, we use the primitive column().  It accepts either the column position or the column name.q = column(1)\n#-> column(1)\n\nq(@VectorTree (name = String, salary = Int) [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112])\n#-> [\"GARRY M\", \"ANTHONY R\", \"DANA A\"]\n\nq = column(:salary)\n#-> column(:salary)\n\nq(@VectorTree (name = String, salary = Int) [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112])\n#-> [260004, 185364, 170112]Finally, we can apply an arbitrary transformation to a selected column of a tuple vector.q = in_tuple(:name, lift(titlecase))\n#-> in_tuple(:name, lift(titlecase))\n\nq(@VectorTree (name = String, salary = Int) [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112]) |> display\n#=>\nTupleVector of 3 × (name = String, salary = Int):\n (name = \"Garry M\", salary = 260004)\n (name = \"Anthony R\", salary = 185364)\n (name = \"Dana A\", salary = 170112)\n=#"
},

{
    "location": "queries.html#Block-vectors-1",
    "page": "Query Backend",
    "title": "Block vectors",
    "category": "section",
    "text": "Primitive as_block() wraps the elements of the input vector to one-element blocks.q = as_block()\n#-> as_block()\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> @VectorTree [String] [\"GARRY M\", \"ANTHONY R\", \"DANA A\"]In the opposite direction, primitive flat_block() flattens a block vector with block elements.q = flat_block()\n#-> flat_block()\n\nq(@VectorTree [[String]] [[[\"GARRY M\"], [\"ANTHONY R\", \"DANA A\"]], [missing, [\"JOSE S\"], [\"CHARLES S\"]]])\n#-> @VectorTree [String] [[\"GARRY M\", \"ANTHONY R\", \"DANA A\"], [\"JOSE S\", \"CHARLES S\"]]Finally, we can apply an arbitrary transformation to every element of a block vector.q = in_block(lift(titlecase))\n#-> in_block(lift(titlecase))\n\nq(@VectorTree [String] [[\"GARRY M\", \"ANTHONY R\", \"DANA A\"], [\"JOSE S\", \"CHARLES S\"]])\n#-> @VectorTree [String] [[\"Garry M\", \"Anthony R\", \"Dana A\"], [\"Jose S\", \"Charles S\"]]The pull_block() primitive converts a tuple vector with a block column to a block vector of tuples.q = pull_block(1)\n#-> pull_block(1)\n\nq(@VectorTree ([Int], [Int]) [\n    [260004, 185364, 170112]    200000\n    missing                     200000\n    [202728, 197736]            [200000, 200000]]\n) |> display\n#=>\nBlockVector of 3 × [(Int, [Int])]:\n [(260004, 200000), (185364, 200000), (170112, 200000)]\n missing\n [(202728, [200000, 200000]), (197736, [200000, 200000])]\n=#It is also possible to pull all block columns from a tuple vector.q = pull_every_block()\n#-> pull_every_block()\n\nq(@VectorTree ([Int], [Int]) [\n    [260004, 185364, 170112]    200000\n    missing                     200000\n    [202728, 197736]            [200000, 200000]]\n) |> display\n#=>\nBlockVector of 3 × [(Int, Int)]:\n [(260004, 200000), (185364, 200000), (170112, 200000)]\n missing\n [(202728, 200000), (202728, 200000), (197736, 200000), (197736, 200000)]\n=#"
},

{
    "location": "queries.html#Index-vectors-1",
    "page": "Query Backend",
    "title": "Index vectors",
    "category": "section",
    "text": "An index vector could be dereferenced using the dereference() primitive.q = dereference()\n#-> dereference()\n\nq(@VectorTree &DEPT [1, 1, 1, 2] where {DEPT = [\"POLICE\", \"FIRE\"]})\n#-> [\"POLICE\", \"POLICE\", \"POLICE\", \"FIRE\"]"
},

{
    "location": "queries.html#Composition-1",
    "page": "Query Backend",
    "title": "Composition",
    "category": "section",
    "text": "We can compose a sequence of transformations using the chain_of() combinator.q = chain_of(\n        column(:employee),\n        in_block(lift(titlecase)))\n#-> chain_of(column(:employee), in_block(lift(titlecase)))\n\nq(@VectorTree (department = String, employee = [String]) [\n    \"POLICE\"    [\"GARRY M\", \"ANTHONY R\", \"DANA A\"]\n    \"FIRE\"      [\"JOSE S\", \"CHARLES S\"]])\n#-> @VectorTree [String] [[\"Garry M\", \"Anthony R\", \"Dana A\"], [\"Jose S\", \"Charles S\"]]The empty chain chain_of() has an alias pass().q = pass()\n#-> pass()\n\nq([\"GARRY M\", \"ANTHONY R\", \"DANA A\"])\n#-> [\"GARRY M\", \"ANTHONY R\", \"DANA A\"]"
},

{
    "location": "combinators.html#",
    "page": "Query Algebra",
    "title": "Query Algebra",
    "category": "page",
    "text": ""
},

{
    "location": "combinators.html#Query-Algebra-1",
    "page": "Query Algebra",
    "title": "Query Algebra",
    "category": "section",
    "text": "using DataKnots\nusing DataKnots.Combinators\n\nF = (It .+ 4) >> (It .* 6)\n#-> (It .+ 4) >> It .* 6\n\nquery(3, F)\n#=>\n│ DataKnot │\n├──────────┤\n│       42 │\n=#\n\nprepare(DataKnot(3) >> F)\n#=>\nchain_of(lift_block([3]),\n         in_block(chain_of(tuple_of([], [as_block(), lift_block([4])]),\n                           lift_to_block_tuple(+))),\n         flat_block(),\n         in_block(chain_of(tuple_of([], [as_block(), lift_block([6])]),\n                           lift_to_block_tuple(*))),\n         flat_block())\n=#\n\nusedb!(\n    @VectorTree (name = [String], employee = [(name = [String], salary = [Int])]) [\n        \"POLICE\"    [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112]\n        \"FIRE\"      [\"JOSE S\" 202728; \"CHARLES S\" 197736]\n    ])\n#=>\n  │ DataKnot                                                   │\n  │ name    employee                                           │\n──┼────────────────────────────────────────────────────────────┤\n1 │ POLICE  GARRY M, 260004; ANTHONY R, 185364; DANA A, 170112 │\n2 │ FIRE    JOSE S, 202728; CHARLES S, 197736                  │\n=#\n\nquery(Field(:name))\n#=>\n  │ name   │\n──┼────────┤\n1 │ POLICE │\n2 │ FIRE   │\n=#\n\nquery(It.name)\n#=>\n  │ name   │\n──┼────────┤\n1 │ POLICE │\n2 │ FIRE   │\n=#\n\n@query name\n#=>\n  │ name   │\n──┼────────┤\n1 │ POLICE │\n2 │ FIRE   │\n=#\n\nquery(Field(:employee) >> Field(:salary))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n3 │ 170112 │\n4 │ 202728 │\n5 │ 197736 │\n=#\n\nquery(It.employee.salary)\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n3 │ 170112 │\n4 │ 202728 │\n5 │ 197736 │\n=#\n\n@query employee.salary\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n3 │ 170112 │\n4 │ 202728 │\n5 │ 197736 │\n=#\n\nquery(Count(It.employee))\n#=>\n  │ DataKnot │\n──┼──────────┤\n1 │        3 │\n2 │        2 │\n=#\n\n@query count(employee)\n#=>\n  │ DataKnot │\n──┼──────────┤\n1 │        3 │\n2 │        2 │\n=#\n\nquery(Count)\n#=>\n│ DataKnot │\n├──────────┤\n│        2 │\n=#\n\n@query count()\n#=>\n│ DataKnot │\n├──────────┤\n│        2 │\n=#\n\nquery(Count(It.employee) >> Max)\n#=>\n│ DataKnot │\n├──────────┤\n│        3 │\n=#\n\n@query count(employee).max()\n#=>\n│ DataKnot │\n├──────────┤\n│        3 │\n=#\n\nquery(It.employee >> Filter(It.salary .> 200000))\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\n@query employee.filter(salary>200000)\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\n@query begin\n    employee\n    filter(salary>200000)\nend\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\nquery(Count(It.employee) .> 2)\n#=>\n  │ DataKnot │\n──┼──────────┤\n1 │     true │\n2 │    false │\n=#\n\n@query count(employee)>2\n#=>\n  │ DataKnot │\n──┼──────────┤\n1 │     true │\n2 │    false │\n=#\n\nquery(Filter(Count(It.employee) .> 2))\n#=>\n  │ DataKnot                                                   │\n  │ name    employee                                           │\n──┼────────────────────────────────────────────────────────────┤\n1 │ POLICE  GARRY M, 260004; ANTHONY R, 185364; DANA A, 170112 │\n=#\n\n@query filter(count(employee)>2)\n#=>\n  │ DataKnot                                                   │\n  │ name    employee                                           │\n──┼────────────────────────────────────────────────────────────┤\n1 │ POLICE  GARRY M, 260004; ANTHONY R, 185364; DANA A, 170112 │\n=#\n\nquery(Filter(Count(It.employee) .> 2) >> Count)\n#=>\n│ DataKnot │\n├──────────┤\n│        1 │\n=#\n\n@query begin\n    filter(count(employee)>2)\n    count()\nend\n#=>\n│ DataKnot │\n├──────────┤\n│        1 │\n=#\n\nquery(Record(It.name, :size => Count(It.employee)))\n#=>\n  │ DataKnot     │\n  │ name    size │\n──┼──────────────┤\n1 │ POLICE     3 │\n2 │ FIRE       2 │\n=#\n\n@query record(name, size => count(employee))\n#=>\n  │ DataKnot     │\n  │ name    size │\n──┼──────────────┤\n1 │ POLICE     3 │\n2 │ FIRE       2 │\n=#\n\nquery(It.employee >> Filter(It.salary .> It.S),\n      S=200000)\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\nquery(\n    Given(:S => Max(It.employee.salary),\n        It.employee >> Filter(It.salary .== It.S)))\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\n@query begin\n    employee\n    filter(salary>S)\nend where { S = 200000 }\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\n@query given(\n        S => max(employee.salary),\n        employee.filter(salary==S))\n#=>\n  │ employee        │\n  │ name     salary │\n──┼─────────────────┤\n1 │ GARRY M  260004 │\n2 │ JOSE S   202728 │\n=#\n\nquery(It.employee.salary >> Sort)\n#=>\n  │ salary │\n──┼────────┤\n1 │ 170112 │\n2 │ 185364 │\n3 │ 197736 │\n4 │ 202728 │\n5 │ 260004 │\n=#\n\n@query employee.salary.sort()\n#=>\n  │ salary │\n──┼────────┤\n1 │ 170112 │\n2 │ 185364 │\n3 │ 197736 │\n4 │ 202728 │\n5 │ 260004 │\n=#\n\nquery(It.employee.salary >> Desc >> Sort)\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 202728 │\n3 │ 197736 │\n4 │ 185364 │\n5 │ 170112 │\n=#\n\n@query employee.salary.desc().sort()\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 202728 │\n3 │ 197736 │\n4 │ 185364 │\n5 │ 170112 │\n=#\n\nquery(It.employee >> Sort(It.salary))\n#=>\n  │ employee          │\n  │ name       salary │\n──┼───────────────────┤\n1 │ DANA A     170112 │\n2 │ ANTHONY R  185364 │\n3 │ CHARLES S  197736 │\n4 │ JOSE S     202728 │\n5 │ GARRY M    260004 │\n=#\n\n@query employee.sort(salary)\n#=>\n  │ employee          │\n  │ name       salary │\n──┼───────────────────┤\n1 │ DANA A     170112 │\n2 │ ANTHONY R  185364 │\n3 │ CHARLES S  197736 │\n4 │ JOSE S     202728 │\n5 │ GARRY M    260004 │\n=#\n\nquery(It.employee >> Sort(It.salary >> Desc))\n#=>\n  │ employee          │\n  │ name       salary │\n──┼───────────────────┤\n1 │ GARRY M    260004 │\n2 │ JOSE S     202728 │\n3 │ CHARLES S  197736 │\n4 │ ANTHONY R  185364 │\n5 │ DANA A     170112 │\n=#\n\n@query employee.sort(salary.desc())\n#=>\n  │ employee          │\n  │ name       salary │\n──┼───────────────────┤\n1 │ GARRY M    260004 │\n2 │ JOSE S     202728 │\n3 │ CHARLES S  197736 │\n4 │ ANTHONY R  185364 │\n5 │ DANA A     170112 │\n=#\n\nquery(It.employee.salary >> Take(3))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n3 │ 170112 │\n=#\n\nquery(It.employee.salary >> Drop(3))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 202728 │\n2 │ 197736 │\n=#\n\nquery(It.employee.salary >> Take(-3))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n=#\n\nquery(It.employee.salary >> Drop(-3))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 170112 │\n2 │ 202728 │\n3 │ 197736 │\n=#\n\nquery(It.employee.salary >> Take(Count(thedb() >> It.employee) .÷ 2))\n#=>\n  │ salary │\n──┼────────┤\n1 │ 260004 │\n2 │ 185364 │\n=#\n\nquery(It.employee >> Group(:grade => It.salary .÷ 100000))\n#=>\n  │ DataKnot                                                    │\n  │ grade  employee                                             │\n──┼─────────────────────────────────────────────────────────────┤\n1 │     1  ANTHONY R, 185364; DANA A, 170112; CHARLES S, 197736 │\n2 │     2  GARRY M, 260004; JOSE S, 202728                      │\n=#\n\n@query employee.group(grade => salary ÷ 100000)\n#=>\n  │ DataKnot                                                    │\n  │ grade  employee                                             │\n──┼─────────────────────────────────────────────────────────────┤\n1 │     1  ANTHONY R, 185364; DANA A, 170112; CHARLES S, 197736 │\n2 │     2  GARRY M, 260004; JOSE S, 202728                      │\n=#\n\n@query begin\n    employee\n    group(grade => salary ÷ 100000)\n    record(\n        grade,\n        size => count(employee),\n        low => min(employee.salary),\n        high => max(employee.salary),\n        avg => mean(employee.salary),\n        employee.salary.sort())\nend\n#=>\n  │ DataKnot                                                      │\n  │ grade  size  low     high    avg       salary                 │\n──┼───────────────────────────────────────────────────────────────┤\n1 │     1     3  170112  197736  184404.0  170112; 185364; 197736 │\n2 │     2     2  202728  260004  231366.0  202728; 260004         │\n=#\n\nusedb!(\n    @VectorTree (department = [(name = [String],)],\n                 employee = [(name = [String], department = [String], position = [String], salary = [Int])]) [\n        (department = [\n            \"POLICE\"\n            \"FIRE\"\n         ],\n         employee = [\n            \"JAMES A\"   \"POLICE\"    \"SERGEANT\"      110370\n            \"MICHAEL W\" \"POLICE\"    \"INVESTIGATOR\"  63276\n            \"STEVEN S\"  \"FIRE\"      \"CAPTAIN\"       123948\n            \"APRIL W\"   \"FIRE\"      \"PARAMEDIC\"     54114\n        ])\n    ]\n)\n#=>\n│ DataKnot                                                                     …\n│ department    employee                                                       …\n├──────────────────────────────────────────────────────────────────────────────…\n│ POLICE; FIRE  JAMES A, POLICE, SERGEANT, 110370; MICHAEL W, POLICE, INVESTIGA…\n=#\n\n@query begin\n    record(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\nend\n#=>\n│ DataKnot                                                                     …\n│ department                                                                   …\n├──────────────────────────────────────────────────────────────────────────────…\n│ POLICE, JAMES A, POLICE, SERGEANT, 110370; MICHAEL W, POLICE, INVESTIGATOR, 6…\n=#\n\n@query begin\n    record(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\n    employee.record(name, department_name => department.name)\nend\n#=>\n  │ DataKnot                   │\n  │ name       department_name │\n──┼────────────────────────────┤\n1 │ JAMES A    POLICE          │\n2 │ MICHAEL W  POLICE          │\n3 │ STEVEN S   FIRE            │\n4 │ APRIL W    FIRE            │\n=#\n\n@query begin\n    record(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\n    department.record(name, size => count(employee), max_salary => max(employee.salary))\nend\n#=>\n  │ DataKnot                 │\n  │ name    size  max_salary │\n──┼──────────────────────────┤\n1 │ POLICE     2      110370 │\n2 │ FIRE       2      123948 │\n=#\n\n@query begin\n    weave(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\nend\n#=>\n│ DataKnot                       │\n│ department  employee           │\n├────────────────────────────────┤\n│ [1]; [2]    [1]; [2]; [3]; [4] │\n=#\n\n@query begin\n    weave(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\n    employee.record(name, department_name => department.name)\nend\n#=>\n  │ DataKnot                   │\n  │ name       department_name │\n──┼────────────────────────────┤\n1 │ JAMES A    POLICE          │\n2 │ MICHAEL W  POLICE          │\n3 │ STEVEN S   FIRE            │\n4 │ APRIL W    FIRE            │\n=#\n\n@query begin\n    weave(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\n    department.record(name, size => count(employee), max_salary => max(employee.salary))\nend\n#=>\n  │ DataKnot                 │\n  │ name    size  max_salary │\n──┼──────────────────────────┤\n1 │ POLICE     2      110370 │\n2 │ FIRE       2      123948 │\n=#\n\n@query begin\n    weave(\n        department.graft(name, employee.index(department)),\n        employee.graft(department, department.unique_index(name)))\n    department\n    employee\n    department\n    employee\n    name\nend\n#=>\n  │ name      │\n──┼───────────┤\n1 │ JAMES A   │\n2 │ MICHAEL W │\n3 │ JAMES A   │\n4 │ MICHAEL W │\n5 │ STEVEN S  │\n6 │ APRIL W   │\n7 │ STEVEN S  │\n8 │ APRIL W   │\n=#\n\nusedb!(\n    @VectorTree (department = [&DEPT], employee = [&EMP]) [\n        [1, 2]  [1, 2, 3, 4]\n    ] where {\n        DEPT = @VectorTree (name = [String], employee = [&EMP]) [\n            \"POLICE\"    [1, 2]\n            \"FIRE\"      [3, 4]\n        ]\n        ,\n        EMP = @VectorTree (name = [String], department = [&DEPT], position = [String], salary = [Int]) [\n            \"JAMES A\"   1   \"SERGEANT\"      110370\n            \"MICHAEL W\" 1   \"INVESTIGATOR\"  63276\n            \"STEVEN S\"  2   \"CAPTAIN\"       123948\n            \"APRIL W\"   2   \"PARAMEDIC\"     54114\n        ]\n    }\n)\n#=>\n│ DataKnot                       │\n│ department  employee           │\n├────────────────────────────────┤\n│ [1]; [2]    [1]; [2]; [3]; [4] │\n=#\n\n@query department.name\n#=>\n  │ name   │\n──┼────────┤\n1 │ POLICE │\n2 │ FIRE   │\n=#\n\n@query department.employee.name\n#=>\n  │ name      │\n──┼───────────┤\n1 │ JAMES A   │\n2 │ MICHAEL W │\n3 │ STEVEN S  │\n4 │ APRIL W   │\n=#\n\n@query employee.department.name\n#=>\n  │ name   │\n──┼────────┤\n1 │ POLICE │\n2 │ POLICE │\n3 │ FIRE   │\n4 │ FIRE   │\n=#\n\n@query employee.position\n#=>\n  │ position     │\n──┼──────────────┤\n1 │ SERGEANT     │\n2 │ INVESTIGATOR │\n3 │ CAPTAIN      │\n4 │ PARAMEDIC    │\n=#\n\n@query count(department)\n#=>\n│ DataKnot │\n├──────────┤\n│        2 │\n=#\n\n@query max(employee.salary)\n#=>\n│ salary │\n├────────┤\n│ 123948 │\n=#\n\n@query department.count(employee)\n#=>\n  │ DataKnot │\n──┼──────────┤\n1 │        2 │\n2 │        2 │\n=#\n\n@query max(department.count(employee))\n#=>\n│ DataKnot │\n├──────────┤\n│        2 │\n=#\n\n@query employee.filter(salary>100000).name\n#=>\n  │ name     │\n──┼──────────┤\n1 │ JAMES A  │\n2 │ STEVEN S │\n=#\n\n@query begin\n    department\n    filter(count(employee)>=2)\n    count()\nend\n#=>\n│ DataKnot │\n├──────────┤\n│        2 │\n=#\n\n@query department.record(name, size => count(employee))\n#=>\n  │ DataKnot     │\n  │ name    size │\n──┼──────────────┤\n1 │ POLICE     2 │\n2 │ FIRE       2 │\n=#"
},

{
    "location": "lifting.html#",
    "page": "Lifting Scalar Functions to Combinators",
    "title": "Lifting Scalar Functions to Combinators",
    "category": "page",
    "text": ""
},

{
    "location": "lifting.html#Lifting-Scalar-Functions-to-Combinators-1",
    "page": "Lifting Scalar Functions to Combinators",
    "title": "Lifting Scalar Functions to Combinators",
    "category": "section",
    "text": "using DataKnots\n\nusedb!(\n    @VectorTree (name = [String], employee = [(name = [String], salary = [Int])]) [\n        \"POLICE\"    [\"GARRY M\" 260004; \"ANTHONY R\" 185364; \"DANA A\" 170112]\n        \"FIRE\"      [\"JOSE S\" 202728; \"CHARLES S\" 197736]\n    ])\n#=>\n  │ DataKnot                                                   │\n  │ name    employee                                           │\n──┼────────────────────────────────────────────────────────────┤\n1 │ POLICE  GARRY M, 260004; ANTHONY R, 185364; DANA A, 170112 │\n2 │ FIRE    JOSE S, 202728; CHARLES S, 197736                  │\n=#\n\nquery(It.employee.name)\n#=>\n  │ name      │\n──┼───────────┤\n1 │ GARRY M   │\n2 │ ANTHONY R │\n3 │ DANA A    │\n4 │ JOSE S    │\n5 │ CHARLES S │\n=#\n\nTitleCase = Lift(s -> titlecase(s), It)\n\nquery(It.employee.name >> TitleCase)\n#=>\n  │ DataKnot  │\n──┼───────────┤\n1 │ Garry M   │\n2 │ Anthony R │\n3 │ Dana A    │\n4 │ Jose S    │\n5 │ Charles S │\n=#\n\n@query(titlecase(employee.name))\n#=>\n  │ DataKnot  │\n──┼───────────┤\n1 │ Garry M   │\n2 │ Anthony R │\n3 │ Dana A    │\n4 │ Jose S    │\n5 │ Charles S │\n=#\n\nSplit = Lift(s -> split(s), It)\n\nquery(It.employee.name >> Split)\n#=>\n   │ DataKnot │\n───┼──────────┤\n 1 │ GARRY    │\n 2 │ M        │\n 3 │ ANTHONY  │\n 4 │ R        │\n 5 │ DANA     │\n 6 │ A        │\n 7 │ JOSE     │\n 8 │ S        │\n 9 │ CHARLES  │\n10 │ S        │\n=#\n\nquery(:employee =>\n  It.employee >>\n    Record(:name =>\n      It.name >> Split))\n#=>\n  │ employee   │\n  │ name       │\n──┼────────────┤\n1 │ GARRY; M   │\n2 │ ANTHONY; R │\n3 │ DANA; A    │\n4 │ JOSE; S    │\n5 │ CHARLES; S │\n=#\n\nRepeat(V,N) = Lift((v,n) -> [v for i in 1:n], V, N)\nquery(Record(It.name, Repeat(\"Go!\", 3)))\n#=>\n  │ DataKnot              │\n  │ name    #2            │\n──┼───────────────────────┤\n1 │ POLICE  Go!; Go!; Go! │\n2 │ FIRE    Go!; Go!; Go! │\n=#"
},

]}

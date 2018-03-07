#
# Backend algebra.
#

module Queries

export
    Query,
    any_block,
    as_block,
    chain_of,
    column,
    count_block,
    decode_missing,
    decode_tuple,
    decode_vector,
    dereference,
    designate,
    flat_block,
    flat_tuple,
    in_block,
    in_tuple,
    ishape,
    lift,
    lift_block,
    lift_const,
    lift_null,
    lift_to_block,
    lift_to_block_tuple,
    lift_to_tuple,
    pass,
    pull_block,
    pull_every_block,
    sieve,
    shape,
    tuple_of

using ..Layouts
import ..Layouts: syntax

using ..Vectors
import ..Vectors:
    column,
    dereference

using ..Shapes: AbstractShape, AnyShape, NoneShape

using Base: OneTo
import Base:
    show

using Base.Cartesian

include("queries/query.jl")
include("queries/lift.jl")
include("queries/decode.jl")
include("queries/chain.jl")
include("queries/tuple.jl")
include("queries/block.jl")
include("queries/index.jl")
include("queries/sieve.jl")

end

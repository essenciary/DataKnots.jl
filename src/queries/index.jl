#
# Operations on index vectors.
#

"""
    dereference()

Dereferences an index vector.
"""
dereference() = Query(dereference)

function dereference(rt::Runtime, input::AbstractVector)
    input isa SomeIndexVector || error("expected an index vector; got $input")
    dereference(input, rt.refs)
end


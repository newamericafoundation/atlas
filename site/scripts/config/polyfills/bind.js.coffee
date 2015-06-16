if not Function.prototype.bind

  Function.prototype.bind = (oThis) ->

    if (typeof @ isnt 'function')
      # closest thing possible to the ECMAScript 5
      # internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')

    aArgs   = Array.prototype.slice.call(arguments, 1)
    fToBind = @
    fNOP    = () -> return
    fBound  = ->
      context = if (@ instanceof fNOP) then @ else oThis
      fToBind.apply(context, aArgs.concat(Array.prototype.slice.call(arguments)))

    fNOP.prototype = @prototype
    fBound.prototype = new fNOP()

    return fBound
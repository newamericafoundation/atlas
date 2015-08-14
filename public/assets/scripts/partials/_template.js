if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/misc/attribution.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div class=\'atl__attribution__link\'>\n\tImage Credit:<br>\n\t');
    
      __out.push(this.linkHtml);
    
      __out.push(' \n</div>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/misc/search.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<input type="text" placeholder="');
    
      __out.push(__sanitize(this.placeholder));
    
      __out.push('">');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/hex_button.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg xmlns=\'http://www.w3.org/2000/svg\' class="hex-button" viewBox="0 0 100 100">\n\t<g class="hex-button__border">\n\t\t<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>\n\t</g>\n\t<g class="hex-button__yes">\n\t\t<polygon points="70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5"/>\n\t</g>\n\t<g class="hex-button__no">\n\t\t<polygon points="72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2,57.8,50"/>\n\t</g>\n\t<g class="hex-button__down">\n\t\t<path d="M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z"/>\n\t</g>\n\t<g class="hex-button__up">\n\t\t<path d="M38.4,53c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l14.4-14.4l0,0l0.3-0.3c0.8-0.8,2-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3l0.3,0.3l0,0l14.4,14.4c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0l-7.2-7.2v19.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1V45.8L38.4,53z"/>\n\t</g>\n\t<g class="hex-button__left">\n\t\t<path d="M53,61.6c1.7,1.7,1.7,4.5,0,6.2c-1.7,1.7-4.5,1.7-6.2,0L32.4,53.5l0,0L32,53.1c-0.8-0.8-1.3-2-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1l0.3-0.3l0,0l14.4-14.4c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2l-7.2,7.2h19.1c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1c-0.8,0.8-1.9,1.3-3.1,1.3H45.8L53,61.6z"/>\n\t</g>\n\t<g class="hex-button__right">\n\t\t<path d="M47,38.4c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l14.4,14.4l0,0l0.3,0.3c0.8,0.8,1.3,2,1.3,3.1c0,1.2-0.5,2.3-1.3,3.1l-0.3,0.3l0,0L53.3,67.8c-1.7,1.7-4.5,1.7-6.2,0c-1.7-1.7-1.7-4.5,0-6.2l7.2-7.2H35.1c-1.2,0-2.3-0.5-3.1-1.3c-0.8-0.8-1.3-1.9-1.3-3.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3h19.1L47,38.4z"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/slice_marker.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<?xml version="1.0" encoding="utf-8"?>\n<!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 612 792" enable-background="new 0 0 612 792" xml:space="preserve">\n<g id="left-3">\n\t<path fill="none" stroke="#231F20" stroke-miterlimit="10" d="M194.2,288.5c0-21.4,6.2-41.5,16.8-58.5V32.4\n\t\tC113,70.4,43.8,165.3,43.8,277c0,111,69.2,224.6,167.2,370.4V347.3C200.4,330.2,194.2,310.1,194.2,288.5z"/>\n</g>\n<g id="center-3">\n\t<path fill="none" stroke="#231F20" stroke-miterlimit="10" d="M306,176.7c40,0,75.2,21.2,95,52.9v-197\n\t\tc-29.4-11.5-61.5-17.8-95-17.8s-65.6,6.3-95,17.6V230C230.9,198.1,266.4,176.7,306,176.7z"/>\n\t<path fill="none" stroke="#231F20" stroke-miterlimit="10" d="M306,400.2c-40,0-75.2-21.2-95-52.9v300.1\n\t\tc29.4,43.8,61.5,90.5,95,140.9c33.4-51,65.5-98.2,95-142.4V347.2C381.2,379,346,400.2,306,400.2z"/>\n</g>\n<g id="right-3">\n\t<path fill="none" stroke="#231F20" stroke-miterlimit="10" d="M401,32.6v197c10.6,17.1,16.8,37.2,16.8,58.8s-6.2,41.7-16.8,58.8\n\t\tv298.7C498.3,500.5,568.2,387.7,568.2,277C568.2,166,499,70.7,401,32.6z"/>\n</g>\n<g id="outer">\n\t<g id="outer_1_">\n\t\t<path fill="none" stroke="#000000" stroke-width="1.683530e-02" stroke-miterlimit="10" d="M306,14.8\n\t\t\tc145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3C160.8,570.1,43.8,421.4,43.8,277C43.8,131.8,160.8,14.8,306,14.8z"/>\n\t</g>\n</g>\n<g id="inner_1_">\n\t<g id="inner">\n\t\t<path fill="none" stroke="#000000" stroke-width="1.683530e-02" stroke-miterlimit="10" d="M306,175.8\n\t\t\tc-60.7,0-111.8,51.1-111.8,112.7S244.4,401.1,306,401.1S417.8,350,417.8,288.4S367.6,175.8,306,175.8z"/>\n\t</g>\n</g>\n<g id="left-2">\n\t<g id="left">\n\t\t<path fill="none" stroke="#000000" stroke-width="1.683530e-02" stroke-miterlimit="10" d="M306,788.3\n\t\t\tC160.8,568.3,43.8,420.5,43.8,276.1C43.8,130.9,161.7,14.8,306,14.8v161c-60.7,0-111.8,50.2-111.8,111.8S244.4,401.1,306,401.1\n\t\t\tV788.3z"/>\n\t</g>\n</g>\n<g id="right-2">\n\t<g id="right">\n\t\t<path fill="none" stroke="#000000" stroke-width="1.683530e-02" stroke-miterlimit="10" d="M306,401.1\n\t\t\tc60.7,0,111.8-50.2,111.8-111.8S367.6,175.8,306,175.8v-161c145.2,0,262.2,117.9,262.2,262.2S449.4,569.2,306,788.3V401.1z"/>\n\t</g>\n</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/stripe.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'');
    
      __out.push(__sanitize(70 * this.scale));
    
      __out.push('\' height=\'');
    
      __out.push(__sanitize(70 * this.scale));
    
      __out.push('\'>\n\t<rect width=\'');
    
      __out.push(__sanitize(70 * this.scale));
    
      __out.push('\' height=\'');
    
      __out.push(__sanitize(70 * this.scale));
    
      __out.push('\' fill=\'');
    
      __out.push(__sanitize(this.color1));
    
      __out.push('\'/>\n\t<g transform=\'rotate(45)\'>\n\t\t<rect width=\'');
    
      __out.push(__sanitize(100 * this.scale));
    
      __out.push('\' height=\'');
    
      __out.push(__sanitize(25 * this.scale));
    
      __out.push('\' fill=\'');
    
      __out.push(__sanitize(this.color2));
    
      __out.push('\'/>\n\t\t<rect y=\'');
    
      __out.push(__sanitize(-50 * this.scale));
    
      __out.push('\' width=\'');
    
      __out.push(__sanitize(100 * this.scale));
    
      __out.push('\' height=\'');
    
      __out.push(__sanitize(25 * this.scale));
    
      __out.push('\' fill=\'');
    
      __out.push(__sanitize(this.color2));
    
      __out.push('\'/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/build.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M93.7,79.5L93.7,79.5l-33-33.3l15-15l13.4-8.6l5.3-9.6l-6.2-6.2l-9.6,5.3L70,25.5l-15,15l-14.9-15L40,5.8L19.9,0.4\n\t\t\tl-2.2,2.1l10.7,10.7L18,23.8L7.2,13.1l-2.2,2.1l5.4,20.2l19.2,0.1l-0.1,0.1l15.2,15.2l-5.6,5.6l-3.7-3.7l-5.7,5.7l1.8,1.8\n\t\t\tc-5.1,2-19.2,16-21.1,21.1l-1.8-1.8L3,85.2l13,13l5.7-5.7l-1.8-1.8c5.1-1.9,19.2-16,21.1-21.1l1.8,1.8l5.7-5.7l-3.7-3.7l5.6-5.6\n\t\t\tl33.1,33.2l0.1,0c2.8,2.7,7.3,2.7,10.1-0.1C96.4,86.8,96.4,82.3,93.7,79.5z M91,86.9c-1.2,1.2-3.2,1.3-4.5,0\n\t\t\tc-1.2-1.2-1.2-3.2,0-4.5c1.3-1.2,3.3-1.2,4.5,0C92.2,83.7,92.2,85.7,91,86.9z"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/contract.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M10,30v8h28V10h-8v15.8L10,5.9L5.9,10l19.9,20H10z M10,94.1l20-19.9V90h8V62H10v8h15.8L5.9,90L10,94.1z M70,74.2l20,19.9\n\t\t\tl4.1-4.1L74.2,70H90v-8H62v28h8V74.2z M90,38v-8H74.2l19.9-20L90,5.9L70,25.8V10h-8v28H90z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/dictionary.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M88.1,71.8c0,1-0.8,1.8-1.8,1.8h-29c-2,0-3.9,0.7-5.4,1.8V17.3c0-3,2.4-5.4,5.4-5.4h29c1,0,1.8,0.8,1.8,1.8V71.8z\n\t\t\t M48.2,75.4c-1.5-1.1-3.4-1.8-5.4-1.8h-29c-1,0-1.8-0.8-1.8-1.8V13.7c0-1,0.8-1.8,1.8-1.8h29c3,0,5.4,2.4,5.4,5.4V75.4z M93.5,15.5\n\t\t\th-1.8v-1.8c0-3-2.4-5.4-5.4-5.4h-29c-3,0-5.6,1.5-7.3,3.7c-1.7-2.2-4.3-3.7-7.3-3.7h-29c-3,0-5.4,2.4-5.4,5.4v1.8H6.5\n\t\t\tC3.5,15.5,1,18,1,21V79c0,3,2.4,5.4,5.4,5.4h34.5c3,0,5.4,2.4,5.4,5.4c0,1,0.8,1.8,1.8,1.8h3.6c1,0,1.8-0.8,1.8-1.8\n\t\t\tc0-3,2.4-5.4,5.4-5.4h34.5c3,0,5.4-2.4,5.4-5.4V21C99,18,96.5,15.5,93.5,15.5"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/down.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M72.6,44.2c3.4-3.4,8.8-3.4,12.2,0c3.4,3.4,3.4,8.8,0,12.2L56.8,84.5l0,0l-0.6,0.7c-1.6,1.6-3.8,2.5-6.1,2.5\n\t\t\tc-2.3,0-4.4-0.9-6.1-2.5l-0.6-0.6l0-0.1L15.2,56.4c-3.4-3.4-3.4-8.8,0-12.2c3.4-3.4,8.8-3.4,12.2,0l14,14V20.9\n\t\t\tc0-2.3,0.9-4.5,2.5-6.1c1.6-1.6,3.8-2.5,6.1-2.5c2.3,0,4.5,0.9,6.1,2.5c1.6,1.6,2.5,3.8,2.5,6.1v37.3L72.6,44.2z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/download.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M78.1,42l-5-5L54,56.1V5.9h-8v50.2L26.9,37l-5,5L50,70L78.1,42z M86.1,70v16H13.9V70h-8v24.1h88.2V70H86.1z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/expand.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M34,14V6H6v28h8V18.2l20,19.9l4.1-4.1L18.2,14H34z M34,61.9L14,81.8V66H6v28h28v-8H18.2l19.9-20L34,61.9z M86,81.8L66,61.9\n\t\t\tL61.9,66l19.9,20H66v8h28V66h-8V81.8z M66,6v8h15.8L61.9,34l4.1,4.1l20-19.9V34h8V6H66z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/filter.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M50,25.7c-0.7,0-1.4,0-2.1,0c-10.2-0.2-18.9-2-24.5-3.5c-3.5-0.9-3.5-3,0-3.9c5.7-1.5,15-3.4,26.6-3.4\n\t\t\tc11.8,0,21,1.8,26.6,3.4c3.5,0.9,3.5,3.1,0,4c-5.6,1.5-14.4,3.3-24.5,3.5C51.4,25.7,50.7,25.7,50,25.7 M12.8,19.6\n\t\t\tc0,0.2-0.1,0.5-0.1,0.7c0,0.5,0.1,0.9,0.2,1.3c0.2,0.6,0.5,1.2,0.8,1.8l24.6,34.1c1.3,1.8,2.8,5.2,2.8,7.5v23.3\n\t\t\tc0,2.8,1.8,3.7,3.9,1.8L56.9,80c1.1-0.9,2-2.8,2-4.2V64.9c0-2.3,1.4-5.6,2.7-7.5l24.6-34.1c0.4-0.6,0.7-1.2,0.9-1.9\n\t\t\tc0.1-0.4,0.2-0.8,0.2-1.3c0-0.2,0-0.5-0.1-0.7C85.7,9.3,53.7,9,50,9C46.3,9,14.2,9.3,12.8,19.6"/>\n\t\t<rect x="12.8" y="9" fill="none" width="74.5" height="82.1"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/globe.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M50,7.1C26.3,7.1,7.1,26.3,7.1,50c0,23.7,19.2,42.9,42.9,42.9c23.7,0,42.9-19.2,42.9-42.9C92.9,26.3,73.7,7.1,50,7.1z\n\t\t\t M18.3,30.9v0.3c0-0.1,0-0.1-0.1-0.2C18.3,31,18.3,31,18.3,30.9z M43.8,86.4c-1.9-2.1,1-7.3,0.4-9.6c-0.3-1.4-2.3-2.8-3.3-4\n\t\t\tc-1-1.3-2.4-2.7-3.1-4.2c-0.9-1.9-0.5-2.6,0.4-4.1c0.6-1.1,0.6-2.1,1-3.2c0.1-0.3,1.6-1.8,1.4-2.2c0,0,0-0.1,0-0.1\n\t\t\tc-1.1-0.1-2.1,0.1-2.9-0.6c-0.7-0.6-0.9-2.2-1.5-2.8c-1.6-1.5-4.2-0.6-6-1.9c-1.6-1.1-3.5-2.3-4.5-3.9c-1-1.5-1.4-5.4-3.3-5.8\n\t\t\tc0,1.9-0.3,2.4,0.6,4.3c0.5,1.1,1.5,3.8-0.9,3.1c-0.1-1.9-0.1-3.4-0.6-5.2c-0.5-1.7-1.8-3.4-2.2-5.3c-0.3-1.7-0.2-3.5-0.2-5.3\n\t\t\tc0-1.8-0.6-3.3-0.7-5c1.2-1.9,2.5-3.7,4-5.4c1.1-1.2,2.2-2.3,3.7-2.9c1.5-0.6,3-1.3,4.7-1.7c1.6-0.4,3.6-0.4,5.3-0.5\n\t\t\tc-0.4-1.1-1.6-2.2,0.6-2c1.3,0.1,1.6,1.3,3.1,0.7c-0.6-0.6-2.6-1.9-0.6-2.2c0-0.7,0-1.4,0.1-2.1c0.4-0.2,0.9-0.4,1.4-0.6\n\t\t\tc2.2-0.6,4.5-1,6.9-1.2c0.3,0.1,0.6,0.2,0.9,0.3c0.2-0.1,0.4-0.2,0.6-0.3c0.4,0,0.8,0,1.3,0c5.1,0,10,1.1,14.5,3\n\t\t\tc0.2,0.3,0.5,0.6,0.8,0.9c0.6,0.5,2,0.8,0.6,1c-0.4,0.1-0.8-0.2-1.1,0.2c-0.4,0.4,0.2,0.8-0.6,1.2c-0.8,0.3-1.7-0.3-2.1,0.5\n\t\t\tc-0.4,0.8,0.3,1.9,0.1,2.7c-0.3,1-1.5,0.8-2.4,0.7c-1.8-0.1-3.8-1.4-4.8-2.8c-0.4-0.5-1.1-1.8-0.8-2.4c0.3-0.6,0.8-0.2,1.1-0.6\n\t\t\tc0.3-0.4-0.2-1-0.5-1.1c-0.1,0.7-0.5,0.9-1.1,0.6c-0.9-0.5-0.4-1.3-0.8-2c-0.6-1-2.2-0.7-3.2-1c-0.5-0.2-0.9-0.4-1.4-0.5\n\t\t\tc-0.3,0.2-0.6,0.4-1,0.6c-0.8,0.3-1.7,0.3-2.4,0.8c-2.1,1.6,0.3,1.6,1.5,1.9c1.6,0.4,2.4,1.9,3.6,2.4c1.7,0.7,2.4-0.3,2.2,2.3\n\t\t\tc-1,0.3-1.9-0.2-2.5-1c0.5,0.7,0.7,1.6,0.7,2.6c-1.6,0.6-2.4-0.2-3.7-0.7c-1-0.4-2.5-0.3-3.5-0.9c0-0.3-0.1-0.5,0-0.8\n\t\t\tc1.2,0,2.4-0.1,1.9-1.7c-2.1-0.2-2.7,0.8-3.9,2.1c3.3,1.1,0.3,2.2-1.5,2.1c-1.5-0.1-3.9-0.4-4.8,1.6c-0.8,1.8,1.9,2.2,3.4,2.7\n\t\t\tc0.9,0.3,1.3,0.1,1.9,0.8c0.7,0.7,0.3,1.6,1.3,2.2c0.4-0.8-0.4-1.7-0.2-2.2c0.5-1.1,1.1-0.5,2.2-0.9c-0.5-1.2-2.1-1.6-1.8-2.9\n\t\t\tc0.4-1.4,2.3-1.3,3.4-1.3c1.8,0.1,1.8,1,3.1,1.5c2,0.7,2-0.7,3.4,1.4c1.4,2.2,2.9,3.3,4.8,5.1c3.4,3.2-2.7,3.1-3.4,0.7\n\t\t\tc0.3-0.1,0.7-0.5,0.9-0.5c-1.3-0.6-4.1-0.5-5.6-0.2c-0.1,0.3-0.1,0.5,0,0.9c1.3,0.1,1.7,0.1,2.5,0.6c0.2,0.2-0.1,0.9,0.3,1.2\n\t\t\tc0.3,0.2,1.4-0.1,1.8-0.1c0.3,2.1-4.4,1.3-5.5,2c0,0.4-0.3,0.8-0.2,1.2c-2.7-0.4-2.6,2.2-3.5,3.8c-0.7,1.2-2.1,2-2.9,3.1\n\t\t\tc-0.4,0.5-1.1,1-1,1.7c0.1,1.2,1.6,0.6,1.6,1.7c0,2.3-3-0.1-3.4-1.2c-2.7-0.6-6.2-0.9-7.2,2.2c-0.4,1.3,0.1,3.1,1.7,3.2\n\t\t\tc1.4,0.1,0.9-0.8,1.8-1.2c0.6-0.2,1.5,0,2.1,0c0.5,1.3,0.3,1.9,0.9,2.9c0.8,1.1,0.8,0.9,1.3,2.2c0.3,1,0.6,2,1.8,2.5\n\t\t\tc1.1,0.4,2.6-0.5,2.7,1.3c2.2,0.1,4,0,5.7,1.3c1.3,1,1.9,2.1,3.5,2.6c2.4,0.8,3.2,0.6,3.8,3.1c0.3,1.1-0.6,1.5,1.1,1.9\n\t\t\tc1,0.2,2.2-0.4,3.3-0.4c1.7,0.1,3.4,1.1,3.4,3.1c0,1.1-0.5,1.4-0.9,2.2c-0.5,1-0.6,2.4-1.2,3.3c-1.2,1.9-3.4,1-4.7,2.8\n\t\t\tc-0.5,0.6-0.3,1.6-1,2.2c-0.5,0.5-2,0.5-2.5,0.9c-0.9,0.7-0.5,1.3-1.4,2.2c-0.5,0.5-2,0.3-2.7,0.6c-1.1,0.5-1.7,1.6-2.6,2.2\n\t\t\tC45.8,86.7,44.8,86.6,43.8,86.4z M80.8,65.1c0.2-1.3,0.4-2.7,0.7-4c0.3-1.4,0.5-2.6,0.5-4.1c0-0.7,0-1.7-0.4-2.2\n\t\t\tC81.4,54.7,80,54,79.8,54c-0.8,0-1.6,1.3-2.4,1.5c-1,0.2-1.8-0.3-2.4-1c-0.8-0.9-1.7-1.5-2.5-2.3c-1-1-1.2-2.4-1.2-3.7\n\t\t\tc0-1.4,0.1-2.3,0.5-3.6c0.2-0.6,0.3-1.1,0.5-1.7c0.3-1.2,0.3-0.5,0.9-1.2c0.6-0.6,0.8-1.8,1.3-2.6c0.5-0.8,0.9-1.4,1.5-2\n\t\t\tc-1.5-0.6-1.6-3.2-1-4.7c0.7-0.1,3,0.3,1.8-1.4c-0.4-0.5-1.6-0.4-0.9-1.4c0.3-0.5,1.1-0.6,1.6-0.5c0.1-0.6,0.4-0.9,0.9-1.1\n\t\t\tl-0.2-0.1c-0.5-0.4-1.3-1.1-1.7-1.6c-0.5-0.6-0.9-2.2-0.1-2.5c2.3,2.3,4.3,4.9,5.9,7.8c0.1,0.2,0.1,0.4,0.2,0.6\n\t\t\tc0.3,0.7,0.7,1.5,1,2.1c0.1,0.3,0.4,0.6,0.6,0.9c0.6,1.3,1,2.7,1.5,4.1c0,0.1,0,0.3,0,0.4c-1-0.4-1.6-2.1-2.1-3c0,0.3,0,0.7,0,1\n\t\t\tc-0.2,0-0.4,0-0.6-0.2c-0.3-0.6-0.6-1.1-1-1.7c0.1,0.2,0.1,0.4,0,0.6c-1,0-0.8-1.2-1.1-1.9c-0.3-0.8-1.1-1.3-1.9-0.6\n\t\t\tc-0.5,0.5-0.6,1.5-1,2c-0.2,0.3-0.5,0.4-0.7,0.6c-0.2,0.2-0.5,0.2-0.4,0.8c0.9-0.3,1.6-0.4,2.7-0.3c0.7,0.1,2-0.1,2.5,0.3\n\t\t\tc0.3,0.3,0.2,0.8,0.4,1.1c0.2,0.4,0.4,0.6,0.6,0.9c0.4,0.5,0.9,2,1.6,1.9c0-0.2,0.1-0.4,0-0.6c1.3,0.4,1.8,2.8,1.9,4\n\t\t\tc0.3,2.4,0.5,4.9,0.5,7.5c-0.4,6.3-2.4,12.2-5.6,17.3C80.9,68.4,80.7,66,80.8,65.1z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/help.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M49.3,65.4v14.8h0c-4.1,0-7.4-3.3-7.4-7.4C41.8,68.7,45.2,65.4,49.3,65.4L49.3,65.4z M49.3,45.9v14.6h-7.2v-0.8\n\t\t\tc0-2.4,0.3-4.4,0.8-5.9c0.5-1.5,1.4-2.9,2.4-4.1C46,48.8,47.3,47.6,49.3,45.9 M49.3,21.7v10.9c-1.5,0.2-2.8,0.9-3.9,1.9\n\t\t\tc-1.2,1.2-2,3.3-2.4,6.1l-13.8-1.7c0.6-5.1,2.5-9.2,5.8-12.3C38.1,23.5,42.9,21.9,49.3,21.7 M49.3,90.9c-10.7-0.2-20.7-4.4-28.2-12\n\t\t\tC5.1,63,5.1,37,21,21c7.6-7.6,17.6-11.8,28.2-12V1.5C37.1,1.7,25,6.4,15.7,15.7c-19,18.9-19,49.7,0,68.6c9.3,9.3,21.4,14,33.6,14.2\n\t\t\tV90.9z M49.3,60.4V45.9c1-0.9,2.2-1.9,3.6-3c2.3-1.9,3.4-3.6,3.4-5.2c0-1.6-0.5-2.9-1.5-3.8c-1-0.9-2.4-1.4-4.3-1.4\n\t\t\tc-0.4,0-0.8,0-1.2,0.1V21.7c0.5,0,0.9,0,1.4,0c5.5,0,10,1.2,13.3,3.4c4.6,3.1,6.8,7.1,6.8,12.2c0,2.1-0.6,4.1-1.7,6\n\t\t\tc-1.2,2-3.6,4.4-7.3,7.3c-2.7,2.2-4.4,3.9-5.1,5.2c-0.7,1.2-1,2.7-1.1,4.6H49.3z M49.3,80.2V65.4c4.1,0,7.4,3.3,7.4,7.4\n\t\t\tC56.7,76.9,53.4,80.2,49.3,80.2 M79,78.9c-7.7,7.7-18,12-29,12l-0.7,0v7.6l0.7,0c12.4,0,24.8-4.7,34.3-14.2\n\t\t\tc18.9-18.9,18.9-49.7,0-68.6C74.8,6.2,62.4,1.5,50,1.5h-0.7v7.6H50c10.9,0,21.2,4.3,29,12C94.9,37,94.9,63,79,78.9"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/left.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M55.8,72.6c3.4,3.4,3.4,8.8,0,12.2c-3.4,3.4-8.8,3.4-12.2,0L15.5,56.8l0,0l-0.7-0.6c-1.6-1.6-2.5-3.8-2.5-6.1\n\t\t\tc0-2.3,0.9-4.4,2.5-6.1l0.6-0.6l0.1,0l28.1-28.1c3.4-3.4,8.8-3.4,12.2,0c3.4,3.4,3.4,8.8,0,12.2l-14,14h37.3c2.3,0,4.5,0.9,6.1,2.5\n\t\t\tc1.6,1.6,2.5,3.8,2.5,6.1c0,2.3-0.9,4.5-2.5,6.1c-1.6,1.6-3.8,2.5-6.1,2.5H41.7L55.8,72.6z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/list.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M83.8,73H40.4c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h43.4c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC86.2,74.1,85.1,73,83.8,73z"/>\n\t\t<path d="M83.8,42.7H40.4c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h43.4c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC86.2,43.8,85.1,42.7,83.8,42.7z"/>\n\t\t<path d="M83.8,12.5H40.4c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h43.4c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC86.2,13.6,85.1,12.5,83.8,12.5z"/>\n\t\t<path d="M25.9,73h-9.7c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h9.7c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC28.3,74.1,27.2,73,25.9,73z"/>\n\t\t<path d="M25.9,42.7h-9.7c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h9.7c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC28.3,43.8,27.2,42.7,25.9,42.7z"/>\n\t\t<path d="M25.9,12.5h-9.7c-1.3,0-2.4,1.1-2.4,2.4v9.7c0,1.3,1.1,2.4,2.4,2.4h9.7c1.3,0,2.4-1.1,2.4-2.4v-9.7\n\t\t\tC28.3,13.6,27.2,12.5,25.9,12.5z"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/minus.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M42.4,57.6H22c-2.7,0-4.9-2.2-4.9-4.9v-5.4c0-2.7,2.2-4.9,4.9-4.9h20.4l15.2,0H78c2.7,0,4.9,2.2,4.9,4.9v5.4\n\t\t\tc0,2.7-2.2,4.9-4.9,4.9H57.6H42.4z M84.8,15.2c-19.2-19.2-50.4-19.2-69.7,0c-19.2,19.2-19.2,50.4,0,69.7\n\t\t\tc19.2,19.2,50.4,19.2,69.7,0C104.1,65.6,104.1,34.4,84.8,15.2"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/naf.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<rect x="6.6" y="69.2" width="86.9" height="12.2"/>\n\t\t<rect x="6.6" y="44.3" width="86.9" height="12.5"/>\n\t\t<rect x="28" y="19.4" width="65.4" height="12.5"/>\n\t\t<path d="M6.5,25.6c0-3.8,3.1-7,7-7c3.8,0,7,3.1,7,7c0,3.8-3.1,7-7,7C9.6,32.6,6.5,29.5,6.5,25.6"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/no.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<polygon points="50,39.5 30.4,20 20,30.4 39.5,50 20,69.6 30.4,80 50,60.5 69.6,80 80,69.6 60.5,50 80,30.4 69.6,20 \t"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/play.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<polygon points="89.1,50 10.9,1.3 10.9,98.7 \t"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/plus.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M57.6,78c0,2.7-2.2,4.9-4.9,4.9h-5.4c-2.7,0-4.9-2.2-4.9-4.9V57.6H22c-2.7,0-4.9-2.2-4.9-4.9v-5.4c0-2.7,2.2-4.9,4.9-4.9\n\t\t\th20.4V22c0-2.7,2.2-4.9,4.9-4.9h5.4c2.7,0,4.9,2.2,4.9,4.9v20.4H78c2.7,0,4.9,2.2,4.9,4.9v5.4c0,2.7-2.2,4.9-4.9,4.9H57.6V78z\n\t\t\t M84.8,15.2c-19.2-19.2-50.4-19.2-69.7,0c-19.2,19.2-19.2,50.4,0,69.7c19.2,19.2,50.4,19.2,69.7,0C104.1,65.6,104.1,34.4,84.8,15.2\n\t\t\t"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/print.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M50,61.4H17.7v13.2H11c-0.8,0-1.5-0.7-1.5-1.5V52.3H50V38.4H23.7V8H50V2H17.7v23.6c-2.7,0.6-4.8,3-4.8,5.9v6.9h-2\n\t\t\tc-5,0-9,3.1-9,7v27.7c0,5,4,9,9,9h6.8V98H50v-6H23.7V67.4H50V61.4z M68.6,98H50v-6h18.6V98z M68.6,8.4v6.3l-6.5-6.4v12.9h6.5v4.5\n\t\t\th-11V8H50V2h12.1L68.6,8.4z M50,52.3h18.6V38.4H50V52.3z M68.6,61.4H50v6h18.6V61.4z M89,74.6h-6.7V61.4H68.6v6h7.7V92h-7.7v6h13.7\n\t\t\tV82.1H89c5,0,9-4,9-9V45.4c0-3.8-4-7-9-7h-2v-6.9c0-2.9-2-5.3-4.8-5.9v-3.8L68.6,8.4v6.3l6.5,6.4h-6.5v4.5h7.7v12.8h-7.7v13.8h21.9\n\t\t\tv20.8C90.5,73.9,89.8,74.6,89,74.6"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/projects.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<rect x="6.5" y="68.2" width="25.2" height="25.2"/>\n\t\t<rect x="37.4" y="68.2" width="25.2" height="25.2"/>\n\t\t<rect x="68.2" y="68.2" width="25.2" height="25.2"/>\n\t\t<rect x="6.5" y="37.4" width="25.2" height="25.2"/>\n\t\t<rect x="37.4" y="37.4" width="25.2" height="25.2"/>\n\t\t<rect x="68.2" y="37.4" width="25.2" height="25.2"/>\n\t\t<rect x="6.5" y="6.5" width="25.2" height="25.2"/>\n\t\t<rect x="37.4" y="6.5" width="25.2" height="25.2"/>\n\t\t<rect x="68.2" y="6.5" width="25.2" height="25.2"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/report_a_problem.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M58.2,65.8c-0.5-0.8-0.9-1.6-1.1-2.3l3.6-1.4v-9.6L11.3,71.4V16.1L60.8,34v-9.5l-50-18.1C9.8,6.1,8.9,5.9,8.1,5.9\n\t\t\tc-3.3,0-5.7,2.5-5.7,6.4v63.1c0,3.9,2.3,6.3,5.6,6.3c0.9,0,1.8-0.2,2.8-0.5l40.8-15.6c0.3,1,0.9,2.2,1.6,3.4\n\t\t\tc1.4,2.3,3.9,4.6,7.6,5.7v-6.4C59.6,67.7,58.9,66.8,58.2,65.8 M60.8,62.1l2.5-1l1.1,8.2c-1.6-0.1-2.7-0.5-3.6-1v6.4\n\t\t\tc1.3,0.4,2.7,0.6,4.3,0.6c0.1,0,0.1,0,0.2,0c0.2,0,0.3,0,0.5,0c0.1,0.2,0.1,0.4,0.2,0.6l9.1,16.9c0.9,1.4,2.6,1.6,3.8,0.5\n\t\t\tl10.9-10.1c1.2-1.1,1.4-3.1,0.6-4.5l-4.2-8c-0.5-1.5-1.2-4.1-1.5-5.7l-1-6.9c-0.1-1.2-0.1-3.1-0.1-4.2l8.5,3.3\n\t\t\tc0.7,0.2,1.3,0.4,1.9,0.4c2.1,0,3.7-1.6,3.7-4.2V30c0-2.6-1.5-4.2-3.7-4.2c-0.6,0-1.2,0.1-1.9,0.4l-14,5.4c-1-0.9-2.2-1.5-3.3-2\n\t\t\tl-14-5.1V34l11,4c0.3,0.1,0.6,0.3,0.9,0.6c-0.1,0.3-0.1,0.7-0.1,1v4.1c0,1,0.3,2.1,0.7,3.1c-0.5,0.7-1.1,1.3-1.6,1.5l-10.9,4.1\n\t\t\tV62.1z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/right.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M44.2,27.4c-3.4-3.4-3.4-8.8,0-12.2c3.4-3.4,8.8-3.4,12.2,0l28.1,28.1l0,0l0.7,0.6c1.6,1.6,2.5,3.8,2.5,6.1\n\t\t\tc0,2.3-0.9,4.4-2.5,6.1l-0.6,0.6l-0.1,0L56.4,84.8c-3.4,3.4-8.8,3.4-12.2,0c-3.4-3.4-3.4-8.8,0-12.2l14-14H20.9\n\t\t\tc-2.3,0-4.5-0.9-6.1-2.5c-1.6-1.6-2.5-3.8-2.5-6.1c0-2.3,0.9-4.5,2.5-6.1c1.6-1.6,3.8-2.5,6.1-2.5h37.3L44.2,27.4z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/search.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M42.2,65.7l-7.6-8.4c-1-1.1-2.8-1.2-3.9-0.2L7.4,78.2c-1.1,1-1.2,2.8-0.2,3.9l8.3,9.2c1,1.1,2.8,1.2,3.9,0.2l22.8-20.7\n\t\t\tV65.7z M42.2,30.5L42,31c-1.7,4.9-1.6,10.2,0.2,15v14.5c-8.5-8-12-20.5-8-32.2c1.7-4.9,4.5-9,8-12.3V30.5z M42.2,70.8l0.5-0.4\n\t\t\tc1.1-1,1.2-2.8,0.2-3.9l-0.7-0.8V70.8z M63,16.1c-9.3,0-17.6,5.8-20.8,14.5V16c5.6-5.2,13.1-8.2,20.8-8.2c3.3,0,6.7,0.5,10,1.7\n\t\t\tc12.1,4.2,19.9,15.3,20.5,27.3v2.9c-0.1,2.8-0.7,5.7-1.6,8.5C87.5,60.9,75.7,68.8,63,68.8c-3.3,0-6.7-0.5-10-1.7\n\t\t\tc-4.2-1.4-7.8-3.7-10.9-6.5V46c0.2,0.7,0.5,1.3,0.8,2c2.6,5.3,7.1,9.3,12.7,11.3c2.4,0.8,4.8,1.2,7.3,1.2c9.5,0,17.9-6,21-15\n\t\t\tc1.9-5.6,1.6-11.6-1-17c-2.6-5.3-7.1-9.3-12.7-11.3C67.9,16.5,65.5,16.1,63,16.1"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/settings.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M50,76.6c-14.7,0-26.6-11.9-26.6-26.6c0-14.7,11.9-26.6,26.6-26.6c14.7,0,26.6,11.9,26.6,26.6C76.6,64.7,64.7,76.6,50,76.6\n\t\t\t M97.8,40.5h-7.1c-1.1-4.5-2.8-8.7-5.2-12.6l5-5C87.7,17,83,12.3,77.1,9.5l-5,5c-3.8-2.4-8.1-4.2-12.6-5.2V2.2\n\t\t\tc-6.2-2.1-12.8-2.1-19,0v7.1c-4.5,1-8.7,2.8-12.6,5.2l-5-5C17,12.3,12.3,17,9.5,22.9l5,5c-2.4,3.8-4.2,8.1-5.2,12.6H2.2\n\t\t\tc-2.1,6.2-2.1,12.8,0,19h7.1c1.1,4.5,2.8,8.7,5.2,12.6l-5,5C12.3,83,17,87.7,22.9,90.5l5-5c3.8,2.4,8.1,4.2,12.6,5.2v7.1\n\t\t\tc6.2,2.1,12.8,2.1,19,0v-7.1c4.5-1.1,8.7-2.8,12.6-5.2l5,5C83,87.7,87.7,83,90.5,77.1l-5-5c2.4-3.8,4.2-8.1,5.2-12.6h7.1\n\t\t\tC99.9,53.3,100,46.7,97.8,40.5"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/share.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M79.8,67.8c-4.1,0-7.7,1.8-10.2,4.6L36.3,53.2c0.6-1.6,0.9-3.3,0.9-5.1c0-1.9-0.4-3.7-1-5.4l33.2-19.2\n\t\t\tc2.1,2.3,5,3.8,8.4,3.8C84,27.2,89,22.2,89,16c0-6.2-5-11.2-11.2-11.2c-6.2,0-11.2,5-11.2,11.2c0,1,0.1,2,0.4,3L33.6,38.2\n\t\t\tc-2.8-3.4-7-5.5-11.8-5.5c-8.5,0-15.3,6.9-15.3,15.3c0,8.5,6.9,15.3,15.3,15.3c4.8,0,9.1-2.2,11.9-5.7l33.1,19.1\n\t\t\tc-0.5,1.5-0.8,3.1-0.8,4.7c0,7.6,6.1,13.7,13.7,13.7s13.7-6.1,13.7-13.7S87.3,67.8,79.8,67.8"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/up.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<path d="M27.4,55.8c-3.4,3.4-8.8,3.4-12.2,0c-3.4-3.4-3.4-8.8,0-12.2l28.1-28.1l0,0l0.6-0.7c1.6-1.6,3.8-2.5,6.1-2.5\n\t\t\tc2.3,0,4.4,0.9,6.1,2.5l0.6,0.6l0,0.1l28.1,28.1c3.4,3.4,3.4,8.8,0,12.2c-3.4,3.4-8.8,3.4-12.2,0l-14-14v37.3\n\t\t\tc0,2.3-0.9,4.5-2.5,6.1c-1.6,1.6-3.8,2.5-6.1,2.5c-2.3,0-4.5-0.9-6.1-2.5c-1.6-1.6-2.5-3.8-2.5-6.1V41.7L27.4,55.8z"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/icons/yes.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t<g>\n\t\t<polygon points="77.7,21.6 41.9,57.4 22.3,37.8 11.9,48.3 31.4,67.9 31.4,67.9 41.9,78.3 88.1,32.1 \t"/>\n\t</g>\n</svg>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/stripe_pattern/template.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg id="d3">\n\n    <defs>\n        <pattern id="diagonal-stripes" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">\n       \t</pattern>\n    </defs>\n\n    <g id="solid-rects"></g>\n    \n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/stripe_pattern/three_colors.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<pattern id="diagonal-stripes" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">\n  \t<rect x="0" y="0" width="6" height="18" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[0]));
    
      __out.push(';" />\n    <rect x="6" y="0" width="6" height="18" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[1]));
    
      __out.push(';" />\n    <rect x="12" y="0" width="6" height="18" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[2]));
    
      __out.push(';" />\n</pattern>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/templates/svg/stripe_pattern/two_colors.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<pattern id="');
    
      __out.push(__sanitize(this.id));
    
      __out.push('" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">\n    <rect x="0" y="0" width="2" height="8" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[0]));
    
      __out.push(';" />\n    <rect x="2" y="0" width="2" height="8" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[0]));
    
      __out.push(';" />\n    <rect x="4" y="0" width="2" height="8" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[1]));
    
      __out.push(';" />\n    <rect x="6" y="0" width="2" height="8" style="stroke:none; fill:');
    
      __out.push(__sanitize(this.colors[1]));
    
      __out.push(';" />\n</pattern>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div class="fill-parent" id="atl__map"></div>\n\n<div class="atl__base-layer"></div>\n<div class="atl__settings-bar">\n\n\t<div class="atl__headline"></div>\n\t<div class="atl__search"></div>\n\t<div class="atl__filter"></div>\n\n\t<div id="-id-atl__display-toggle" class="-id-atl__display-toggle atl__binary-toggle">\n\n\t\t<div class="atl__binary-toggle__half">\n\t\t\t<a href="#" class="atl__binary-toggle__link atl__binary-toggle__link--active" id="atl__set-filter-display">\n\t\t\t\t<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t\t\t\t\t<path d="M50,21.2c-0.8,0-1.6,0-2.4,0c-12-0.3-22.4-2.4-29-4.1c-4.2-1.1-4.2-3.5-0.1-4.7c6.8-1.8,17.8-4,31.5-4\n\t\t\t\t\tc14,0,24.8,2.2,31.5,4c4.2,1.1,4.1,3.6-0.1,4.7c-6.6,1.7-17,3.9-29,4.1C51.6,21.2,50.8,21.2,50,21.2 M6,14C6,14.2,6,14.5,6,14.8\n\t\t\t\t\tc0,0.6,0.1,1.1,0.2,1.6c0.2,0.7,0.5,1.4,1,2.1l29.1,40.3c1.6,2.2,3.3,6.1,3.3,8.8v27.6c0,3.4,2.1,4.3,4.6,2.1l14-11.9\n\t\t\t\t\tc1.3-1.1,2.3-3.3,2.3-5V67.6c0-2.7,1.6-6.7,3.2-8.8l29-40.3c0.5-0.7,0.8-1.4,1-2.2c0.1-0.5,0.2-1,0.2-1.5c0-0.3,0-0.6-0.1-0.9\n\t\t\t\t\tC92.2,1.8,54.4,1.5,50,1.5C45.6,1.5,7.6,1.8,6,14"/>\n\t\t\t\t</svg>\n\t\t\t</a>\n\t\t</div>\n\n\t\t<div class="atl__binary-toggle__half">\n\t\t\t<a href="#" class="atl__binary-toggle__link" id="atl__set-search-display">\n\t\t\t\t<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t\t\t\t\t viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">\n\t\t\t\t\t<path d="M19.6,50.7c-0.8,0-1.6-0.4-2-1.2c-2.1-3.6-3.2-7.8-3.2-12c0-10.9,7.2-20.4,17.6-23.2\n\t\t\t\t\t\tc0.2-0.1,0.4-0.1,0.6-0.1c1,0,1.9,0.7,2.2,1.7c0.3,1.2-0.4,2.5-1.6,2.8c-8.4,2.2-14.2,10-14.2,18.8c0,3.4,0.9,6.8,2.6,9.7\n\t\t\t\t\t\tc0.3,0.5,0.4,1.1,0.2,1.7c-0.2,0.6-0.5,1.1-1.1,1.4C20.4,50.6,20,50.7,19.6,50.7z"/>\n\t\t\t\t\t<path d="M32.2,14.9C22.1,17.6,15,26.9,15,37.6c0,4.1,1.1,8.2,3.1,11.7c0.3,0.6,0.9,0.9,1.5,0.9\n\t\t\t\t\t\tc0.3,0,0.6-0.1,0.9-0.2c0.9-0.5,1.2-1.6,0.7-2.4c-1.7-3-2.6-6.5-2.6-10c0-9,6-17,14.6-19.3c0.9-0.3,1.5-1.2,1.3-2.2\n\t\t\t\t\t\tC34.2,15.2,33.2,14.6,32.2,14.9z"/>\n\t\t\t\t\t<path d="M93,98.4c-1.2,0-2.4-0.5-3.3-1.4L68.8,76.1l-9.5-9.5c-6.3,4.7-13.7,7.2-21.6,7.2\n\t\t\t\t\t\tc-19.9,0-36.1-16.2-36.1-36.1c0-19.9,16.2-36.1,36.1-36.1c19.9,0,36.1,16.2,36.1,36.1c0,8.2-2.8,16.1-7.9,22.5l9.6,9.5l20.7,20.7\n\t\t\t\t\t\tc0.9,0.9,1.4,2,1.4,3.3c0,1.2-0.5,2.4-1.4,3.3C95.3,97.9,94.2,98.4,93,98.4z M37.7,9.7c-15.4,0-28,12.6-28,28s12.6,28,28,28\n\t\t\t\t\t\tc15.4,0,28-12.6,28-28S53.1,9.7,37.7,9.7z"/>\n\t\t\t\t</svg>\n\t\t\t</a>\n\t\t</div>\n\n\t</div>\n\n</div>\n\n<div class="atl__legend"></div>\n<div class="atl__info"></div>\n<div class="atl__popup"></div>\n\n<div class="atl__info-box"></div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/templates/zoom_bar.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div class="atl__map-control">\n\t<div id="atl__map-attribution" class="atl__map-control__button bg-img-info--black"></div> \n\t<div id="atl__map-zoom-in"  class="atl__map-control__button bg-img-plus--black"></div>\n\t<div id="atl__map-zoom-out" class="atl__map-control__button bg-img-minus--black"></div>\n\t<div class=\'atl__help atl__help--left\'>\n\t\tView <b>copyright</b> information about the map and <b>zoom</b> in and out.\n\t</div>\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/filter/templates/filter_key.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<p>');
    
      __out.push(__sanitize(this.display_title));
    
      __out.push('</p>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/filter/templates/filter_keys.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<ul></ul>\n<div class=\'atl__help atl__help--right\' id=\'atl__help__filter-keys\'>\n\tSelect the variable you want to filter by.\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/filter/templates/filter_value.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg class="toggle-button__icon" viewBox="0 0 100 100">\n\t<g class="hexicon__hex">\n\t\t<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>\n\t</g>\n\t<g class="hexicon__yes">\n\t\t<polygon points="70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5 \t"/>\n\t</g>\n\t<g class="hexicon__no">\n\t\t<polygon points="72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2,57.8,50"/>\n\t</g>\n</svg>\n\n<div class="toggle-button__text">\n   \t<p>');
    
      __out.push(__sanitize(this.hyphenate(this.value)));
    
      __out.push('</p>\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/filter/templates/filter_values.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push(this.long_description);
    
      __out.push('\n<ul></ul>\n<div class=\'atl__help atl__help--right\' id=\'atl__help__filter-values\'>\n\tSelect the values you want to filter out. Corresponding map colors are indicated.\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/filter/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div id="atl__filter__keys" class="-id-atl__filter__keys"></div>\n<div id="atl__filter__values"></div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/headline/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var sectionText;
    
      sectionText = this.project_section_names != null ? this.project_section_names.join(',<br>').toUpperCase() : '';
    
      __out.push('\n\n<p class="atl__headline__sections">');
    
      __out.push(sectionText);
    
      __out.push('</p>\n\n<h1 class="atl__headline__title">');
    
      __out.push(__sanitize(this.title));
    
      __out.push('</h1>\n\n<h2 class="atl__headline__description">\n\t');
    
      __out.push(__sanitize(this.short_description));
    
      __out.push('<a href="#" class="link">More..</a>\n</h2>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/info_box/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      var website;
    
      __out.push('<a href="#" class="bg-img-no--black atl__info-box__close"></a>\n\n<div class="atl__title-bar atl__title-bar--image bg-c-off-white">\n\n\t<div class="atl__title-bar__background"></div>\n\n\t<div class="atl__title-bar__content">\n\t\t<h1 class=\'title\'>');
    
      __out.push(__sanitize(this.name || this.title));
    
      __out.push('</h1>\n\t\t<ul>\n\n\t\t\t');
    
      website = this.state_website || this.website;
    
      __out.push('\n\n\t\t\t');
    
      if (website != null) {
        __out.push('\n\t\t\t\t<li>\n\t\t\t\t\t<a class="icon-button" href="');
        __out.push(__sanitize(website));
        __out.push('" target="_blank">\n\t\t\t\t\t\t<div class="icon-button__icon bg-img-link--black"></div>\n\t\t\t\t\t\t<div class="icon-button__text">Website</div>\n\t\t\t\t\t</a>\n\t\t\t\t</li>\n\t\t\t');
      }
    
      __out.push('\n\n\t\t</ul>\n\t</div>\n\n</div>\n\n<div class="atl__content-bar bg-c-off-white">\n\n\t<div class="atl-grid">\n\n\t\t<div class="atl-grid__1-3">\n\t\t\t<div class="atl__page-nav">\n\t\t\t\t<div class="atl__toc">\n\t\t\t\t\t<p>Page Contents</p>\n\t\t\t\t\t<div id="atl__toc__list"></div>\n\t\t\t\t</div>\n\t\t\t\t<div id="atl__related"></div>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="atl-grid__2-3">\n\n\t\t\t<div class="static-content">\n\t\t\t\t');
    
      __out.push(this.body_text != null ? this.body_text : void 0);
    
      __out.push('\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class="atl-grid__3-3">\n\t\t</div>\n\n\t</div>\n\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/info_box/templates/section.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<h1>');
    
      __out.push(__sanitize(this.heading));
    
      __out.push('</h1>\n<p>');
    
      __out.push(this.text);
    
      __out.push('</p>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/info/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div class="atl__info__key">\n\t<p>');
    
      __out.push(__sanitize(this.key));
    
      __out.push('</p>\n</div>\n\n<div class="atl__info__value">\n\t<p>');
    
      __out.push(__sanitize(this.value));
    
      __out.push('</p>\n</div>\n\n<div class="atl__info__items">\n\t<p>');
    
      __out.push(__sanitize(this.items));
    
      __out.push('</p>\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/legend/templates/icon.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg viewBox="0 0 100 100">\n\t<g class="hexicon__hex">\n\t\t<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2\n\t\tL44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>\n\t</g>\n\t<g class="hexicon__yes">\n\t\t<polygon points="70.3,31.9 44.3,57.8 30.1,43.6 22.5,51.2 36.7,65.4 36.7,65.4 44.3,73 77.9,39.5 \t"/>\n\t</g>\n\t<g class="hexicon__no">\n\t\t<polygon points="72,35.8 64.4,28.2 50.2,42.4 35.9,28.2 28.3,35.8 42.6,50 28.3,64.2 35.9,71.8 50.2,57.6 64.4,71.8 72,64.2 \n\t\t57.8,50"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/legend/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<ul class="legend-icons"></ul>\n<div class=\'atl__help atl__help--left\' id=\'atl__help__legend\'>\n\tHover on any legend bar icon to learn its meaning, and click it to disable entries on the map.\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/popup/templates/logo.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<svg xmlns=\'http://www.w3.org/2000/svg\' class="hex-button" viewBox="0 0 100 100">\n\t<g class="hex-button__border">\n\t\t<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>\n\t</g>\n\t<g class="hex-button__down">\n\t\t<path d="M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z"/>\n\t</g>\n</svg>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/popup/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<div class="atl__popup__wrapper">\n\t<div class="atl__popup__content">\n\t\t<div id="atl__popup__content__logo" class="atl__popup__content__logo">\n\t\t</div>\n\t\t<div class="atl__popup__content__text">\n\t\t\t<p>');
    
      __out.push(__sanitize(this.name));
    
      __out.push('</p>\n\t\t</div>\n\t</div>\n</div>');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

if (!window.JST_ATL) {
  window.JST_ATL = {};
}
window.JST_ATL["atlas/site/tilemap/submodules/search/templates/root.jst"] = function (__obj) {
  if (!__obj) __obj = {};
  var __out = [], __capture = function(callback) {
    var out = __out, result;
    __out = [];
    callback.call(this);
    result = __out.join('');
    __out = out;
    return __safe(result);
  }, __sanitize = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else if (typeof value !== 'undefined' && value != null) {
      return __escape(value);
    } else {
      return '';
    }
  }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
  __safe = __obj.safe = function(value) {
    if (value && value.ecoSafe) {
      return value;
    } else {
      if (!(typeof value !== 'undefined' && value != null)) value = '';
      var result = new String(value);
      result.ecoSafe = true;
      return result;
    }
  };
  if (!__escape) {
    __escape = __obj.escape = function(value) {
      return ('' + value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    };
  }
  (function() {
    (function() {
      __out.push('<input type="text" placeholder="Search Project">');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
};

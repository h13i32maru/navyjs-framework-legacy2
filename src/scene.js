Navy.Scene = Navy.Class(Navy.ViewGroup.ViewGroup, {
  CLASSNAME: 'Navy.Scene',

  initialize: function($super, layout){
    $super(layout);
    console.log(layout);
  }
});

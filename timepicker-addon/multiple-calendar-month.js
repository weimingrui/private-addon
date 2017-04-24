import Ember from 'ember';

export default Ember.Component.extend({
  init:function () {
    this._super(...arguments);

  },
  mouseEnter:function (e) {
    var olddom = $(".calendar-month-mouseover")
    if(olddom.length>0){
      olddom.removeClass("calendar-month-mouseover");
    }
    $(".calendar-month-"+this.get("index")).addClass("calendar-month-mouseover");
  },
  monthChange:function () {
    if(!this.get("model")){
      return
    }
    var model = this.get("model");
    this.set("month",model.month()+1);
    $(".calendar-month-"+this.get("index")).removeClass("calendar-month-selected")
    this.get("selectDateList").forEach((time)=>{
      if(time.year()==model.year()&&time.month()==this.get("month")-1){
        let domclass = ".calendar-month-"+this.get("index");
        let dom = $(domclass)
        if(dom.length>0&&$(domclass+".calendar-month-selected").length==0){
          dom.addClass("calendar-month-selected");
        }
      }
    });
  }.observes("model"),
  didRender:function () {
    this.monthChange();
  },
  actions:{
    selectedIndexMonth:function () {
      this.sendAction("selectedIndexMonth",this.get("model"))
    }
  }
});

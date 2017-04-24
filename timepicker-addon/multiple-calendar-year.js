import Ember from 'ember';

export default Ember.Component.extend({
  init:function () {
    this._super(...arguments);
  },

  didRender:function () {
    this.yearChange();
  },
  mouseEnter:function (e) {
    var olddom = $(".calendar-year-mouseover")
    if(olddom.length>0){
      olddom.removeClass("calendar-year-mouseover");
    }
    $(".calendar-year-"+this.get("index")).addClass("calendar-year-mouseover");
  },
  mouseLeave:function (e) {
  },
  yearChange:function () {
    if(!this.get("model")){
      return
    }
    var model = this.get("model");
    this.set("year",model.year());
    $(".calendar-year-"+this.get("index")).removeClass("calendar-year-selected")
    this.get("selectDateList").forEach((time)=>{
      if(time.year()==this.get("year")){
        let domclass = ".calendar-year-"+this.get("index");
        let dom = $(domclass)
        if(dom.length>0&&$(domclass+".calendar-year-selected").length==0){
          dom.addClass("calendar-year-selected");
        }
      }
    });
  }.observes("model"),
  actions:{
    selectedIndexYear:function () {
     this.sendAction("selectedIndexYear",this.get("model"))
    }
  }
});

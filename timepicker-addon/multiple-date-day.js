import Ember from 'ember';

export default Ember.Component.extend({
  init:function () {
    this._super(...arguments);
    this.set("date",this.get("model").date());

  },
  didRender:function () {
    /*if(this.isSameDate(this.get("model"),moment())){
      if($(".calendar-date-"+this.get("index")).length>0){
        $(".calendar-date-"+this.get("index")).addClass("date-today")
      };
    }*/
    this.modelChange();
  },
  mouseUp:function(e){
    let cur_target = e.target;
    let click_value = e.button;
    if(click_value==2){
      // remove remark
      this.sendAction("updateSelectedDateList",this.get("model"),"rightUp",cur_target);
    }else if(click_value==0){
      //remark date
      this.sendAction("updateSelectedDateList",this.get("model"),"leftUp",cur_target);
    }
    e.preventDefault();
    return false;
  },
  mouseDown:function(e){
    let cur_target = e.target;
    let click_value = e.button;
    if(click_value==2){
      // remove remark
      this.sendAction("updateSelectedDateList",this.get("model"),"rightDown",cur_target);
    }else if(click_value==0){
      //remark date
      this.sendAction("updateSelectedDateList",this.get("model"),"leftDown",cur_target);
    }
    e.preventDefault();
    return false;
  },
  mouseEnter:function (e) {
    var olddom = $(".calendar-date-mouseover")
    if(olddom.length>0){
      olddom.removeClass("calendar-date-mouseover");
    }
    $(".calendar-date-"+this.get("index")).addClass("calendar-date-mouseover");
  },
  mouseLeave:function (e) {
    var olddom = $(".calendar-date-mouseover")
    if(olddom.length>0){
      olddom.removeClass("calendar-date-mouseover");
    }
  },
  modelChange:function () {
    if(!this.get("model")){
      return
    }
    var model = this.get("model");
    this.set("date",model.date());
    $(".calendar-date-"+this.get("index")).removeClass("calendar-date-selected")
    this.get("selectDateList").forEach((time)=>{
      if(time.year()==model.year()&&time.month()==model.month()&&time.date()==model.date()){
        let domclass = ".calendar-date-"+this.get("index");
        let dom = $(domclass)
        if(dom.length>0&&$(domclass+".calendar-date-selected").length==0){
          dom.addClass("calendar-date-selected");
        }
      }
    });
  }.observes("model","selectDateList"),
  isSameDate:function(time1,time2){
    if(time1.year()==time2.year()&&time1.month()==time2.month()&&time1.date()==time2.date()){
      return true;
    }else{
      return false;
    }
  },
  actions:{

  }
});

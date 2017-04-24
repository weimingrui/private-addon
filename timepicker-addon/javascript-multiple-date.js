import Ember from 'ember';
export default Ember.Component.extend({
  dates:[],
  week:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],
  /*months:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],*/
  years:[],
  selectMonth:"",
  selectYear:"",
  selectDate:"",
  selectStartTime:0,
  model:[],
  indexYear:0,
  indexMonth:0,
  showLayoutMode:0,
  yearRangeText:"",
  init:function () {
    this._super(...arguments);
    this.resetDays(moment());
    if(!this.get("model")){
      this.set("model",[]);
    };
    this.set("selectDateList",[moment().startOf("day")])
  },
  modelChange:function () {

    if(this.get("model")!=undefined){
      this.set("selectDateList",this.get("model"));
    }
  }.observes("model"),
  didRender:function(){
    this.modelChange();
    $(".multiple.calendar-content").on("contextmenu",function(){
      return false;
    });
  },
  initYears:function(time){
    var yearsList = [];
    for(let i=5;i>=-6;i--){
      yearsList.unshift(moment(time).add(i, 'years'));
    }
    this.set("years",yearsList);
  },
  resetDays:function(time){
    var year = time.year();
    var month = time.month()+1;
    this.set("indexYear",time);
    this.set("indexMonth",time);
    this.set("selectYear",time);
    this.set("selectMonth",time);
    this.set("titleYearMonth",time.year()+"年，"+(time.month()+1)+"月");
    var date = ""+year+"-"+month+"-"+"01";
    date = new Date(date);
    let day = date.getDay();
    var lastMonthDays = [];
    for(let i=41-day;i>=-day;i--){
      lastMonthDays.unshift(moment(date).add(i, 'days').startOf('day'));
    }
   this.set("dates",lastMonthDays);
  },
  transfromdateList:function(){

  },
  checkoutDateList:function(time,type){
    var fristTime = this.get("selectStartTime");
    if(this.isSameDate(fristTime,time)){
      var selectTime = fristTime.startOf('day');
      if(type=="remove"){
        this.get("selectDateList").forEach((item)=> {
          if(item&&this.isSameDate(item,selectTime)){
            this.dateListRemoveDate(this.get("selectDateList"),item);
          }
        });

      }else{
        this.get("selectDateList").addObject(selectTime);
        this.dateListAddDate(this.get("selectDateList"));
      }
    }else{
      var selectDateList = this.getRangeTimeList(fristTime,time);
      if(type=="remove"){
        selectDateList.forEach((item)=>{
          this.dateListRemoveDate(this.get("selectDateList"),item);
        });
      }else{
        selectDateList.forEach((item)=>{
            this.get("selectDateList").addObject(item.startOf("day"));
        });
        this.dateListAddDate(this.get("selectDateList"));
      }

    }
    this.sortSelectDateList(this.get("selectDateList"));
    //console.log(this.get("selectDateList"));
    this.set("model",this.get("selectDateList"));
  },
  sortSelectDateList:function(list){
    var dateList = [];
    list.forEach((moment)=>{
      if(dateList.length==0){
        dateList.push(moment);
      }else{
        for(let i=0;i<dateList.length;i++){
          if(dateList[i].unix()>moment.unix()){
            dateList.splice(i,0,moment);
            break;
          }else if(i==dateList.length-1){
            dateList.push(moment);
            break;
          }
        }
      }
    });
    this.set("selectDateList",dateList);
  },
  dateListAddDate:function (list) {
    let newList = [];
    list.forEach((item)=>{
      newList.addObject(item.unix());
    });
    if(list.length!=newList.length){
      this.set("selectDateList",[]);
      newList.forEach((item)=>{
        this.get("selectDateList").addObject(moment(item*1000));
      })
    }
  },
  dateListRemoveDate:function (list,time) {
    list.forEach((item)=>{
      if(item&&this.isSameDate(item,time)){
        list.removeObject(item);
      }
    });
  },
  getRangeTimeList:function(time1,time2){
    let startTime = new Date(time1);
    let endTime =  new Date(time2);
    if(startTime.getTime()>endTime.getTime()){
      startTime = time2;
      endTime = time1;
    }
    startTime = moment(startTime);
    endTime = moment(endTime);

    let dateList = [];
    for(let i=0;;i++){
      let date = moment(startTime).add(i,"days").startOf("day");
      dateList.push(date)
      if(this.isSameDate(date,endTime)){
        break;
      }
    }
    return dateList;
  },
  isSameDate:function(time1,time2){
    if(time1.year()==time2.year()&&time1.month()==time2.month()&&time1.date()==time2.date()){
      return true;
    }else{
      return false;
    }
  },
  updateRangeYears:function () {
    if(!this.get("indexYear")||this.get("showLayoutMode")!=2){
      return ;
    }
    this.initYears(this.get("indexYear"));
    this.set("yearRangeText",this.get("years").objectAt(0).year()+"年 ~ "+this.get("years").objectAt(11).year()+"年");
  }.observes("indexYear","showLayoutMode"),
  selectYearChange:function () {
    if(!this.get("selectYear")||this.get("showLayoutMode")!=1){
      return;
    }
    var firstMonth = this.get("selectYear").startOf("year");
    this.set("months",[]);
    for(let i = 0;i<12;i++){
      this.get("months").addObject(moment(firstMonth).add(i,"months"));
    }
    this.set("titleYearText",this.get("selectYear").year());
  }.observes("selectYear","showLayoutMode"),
  selectMonthChange:function () {
    let month = this.get("selectMonth");
    if(!month||this.get("showLayoutMode")!=0){
      return;
    }
    this.resetDays(month);
  }.observes("selectMonth","showLayoutMode"),
  actions:{
    setShowLayoutMode:function (index) {
      if(typeof index!="undefined"){
        this.set("showLayoutMode",index);
      }else{
        this.set("showLayoutMode",(this.get("showLayoutMode")+1)%3);
      }
    },
    selectedIndexYear:function (year) {
      this.set("selectYear",year);
      this.set("showLayoutMode",1);

    },
    selectedIndexMonth:function (month) {
      this.set("selectMonth",month);
      this.set("showLayoutMode",0);

    },
    updatelayoutMode:function () {

    },
    previouse:function (isyear) {
      let mode = this.get("showLayoutMode");
      if(mode==0){
        let month =this.get("selectMonth");
        let newmopnth = moment(month).subtract(1,"months");
        this.set("selectMonth",newmopnth);
        this.set("indexYear",newmopnth);
      }else if(mode==1){
        let year =this.get("indexYear");
        let newyear = moment(year).subtract(1,"years");
        this.set("selectMonth",newyear);
        this.set("indexYear",newyear);
      }else if(mode==2){
        let year =this.get("indexYear");
        let newyear = moment(year).subtract(12,"years");
        this.set("indexYear",newyear);
      }

    },
    next:function (isyear) {
      let mode = this.get("showLayoutMode");
      if(mode==0){
        let month =this.get("selectMonth");
        let newmopnth = moment(month).add(1,"months");
        this.set("selectMonth",newmopnth);
        this.set("indexYear",newmopnth);
      }else if(mode==1){
        let year =this.get("indexYear");
        let newyear = moment(year).add(1,"years");
        this.set("selectMonth",newyear);
        this.set("indexYear",newyear);
      }else if(mode==2){
        let year =this.get("indexYear");
        let newyear = moment(year).add(12,"years");
        this.set("indexYear",newyear);
      }
    },
    updateSelectedDateList:function(date,type){
      if(type=="rightUp"){
        this.checkoutDateList(date,"remove");
      }else if(type=="rightDown"){
        this.set("selectStartTime",date);
      }else if(type=="leftUp"){
        this.checkoutDateList(date,"add");
      }else if(type=="leftDown"){

        this.set("selectStartTime",date);
      }

    }
  }
});

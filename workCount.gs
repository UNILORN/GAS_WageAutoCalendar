function workCount() {
  var calendar = CalendarApp.getCalendarById('rc05gris7q85pd585v43jc75gs@group.calendar.google.com') // アルバイト用カレンダーID
  var startDate = Moment.moment("2017-01-01") // 記録開始年月日
  var now = Moment.moment().add(3,'months') // 基本記録終了年月日（default : 現在より３ヶ月先）
  var monthCount = now.startOf("month").diff(startDate,"months") // 処理月数
  var report = [] // 全データ格納用変数
  var HourlyWage = 1000 // 時給
  
  // 処理月数分ループ　月ごと
  for (i = 0 ; i < monthCount; i++,startDate.add(1,'months')){
    
    // 一月分のイベントを取得
    var afterDate = Moment.moment(startDate)
    var events = calendar.getEvents(startDate.toDate(),afterDate.endOf('month').toDate())
    var monthWageMinutes = 0 // 一月分の合計勤務分数
    
    events.forEach(function(val){
      var starttime = Moment.moment(val.getStartTime()) 
      var endtime = Moment.moment(val.getEndTime())
      var daysWage = endtime.diff(starttime,"minutes")　// 一回の勤務分数を取得
      
      // 休憩は６時間勤務で１時間
      if(daysWage >= 360){
        daysWage -= 60
      }
      monthWageMinutes += daysWage
    })
    
    var monthWage = monthWageMinutes * Math.round((HourlyWage / 60)) // 月給
    Logger.log(startDate.format("YYYYMMDD") +" ~ "+ afterDate.endOf('month').format("YYYYMMDD")) // 期間をログに出力
    startDate.add(1,'months').set('date',15) // 給料日にセット
    Logger.log(startDate.format("YYYYMMDD")) // 給料日をログに出力
    
    // 既に給料日に終日の予定が存在した場合、そのイベントを削除する
    var wageDayEvents = calendar.getEventsForDay(startDate.toDate())
    var wageDayEvent = null
    wageDayEvents.forEach(function(val){
      if(val.isAllDayEvent()){
        wageDayEvent = val
      }
    })
    if (wageDayEvent != null){
      wageDayEvent.deleteEvent()
    }
    
   
    calendar.createAllDayEvent("給料:" + monthWage , startDate.toDate())  // 給料日に終日の予定を追加
    
    startDate.subtract(1,'months').startOf('month')// 給料日を解除
    
    Logger.log("給料:"+monthWage)
    
    report.push({
      month:startDate.format("YYYYMM"),
      minute:monthWageMinutes,
      wage:monthWage
    })
  }
  
  Logger.log(report) 
}


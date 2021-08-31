library(readr)      # Read files
library(tidyverse)  # All the tidy things
library(dplyr)      # Data Cleaning
library(lubridate)  # Convient Dates
library(matrixStats)# Weighted Median
library(googleVis)  # Year Plot
library(zoo)        # Moving Average
library(rpart)      # Classification
library(rpart.plot) # Plotting Model

invalidate_at <- 10 # Invalidate Heart Rate entrys that are empty for more than an hour

# Functions
get_duration_overlap <- function(data){
   data <- data %>% arrange(end)
   data <- data %>% mutate(duration = difftime(lead(data$end), data$end, units = "mins"))
   data <- data %>% mutate(weight = ifelse(duration > invalidate_at, invalidate_at, duration)) # Validate readings for maximum of 10 minutes
   return(na.omit(data))
}

get_duration_exclusive <- function(data) { 
   data <- data %>% arrange(end)
   data = data %>% mutate(duration =  difftime(data$end, data$start, units = "mins"))
   return(data)
}

get_datetime_range <- function(data){
   min = min(data$start)
   max = max(data$start)
   mindiff = difftime(max, min, units = "mins")
   return(data.frame(time = seq(min, by="min", length.out = mindiff)))
}

yearPlot <- function(data, title=null, min="null", max="null"){ 
   plot(gvisCalendar(data = data, options = list(title = title, calendar="{cellSize:20}", width=1200, height=1000, colorAxis = paste("{minValue: ", min, ", maxValue: ", max, "}", sep = ""))))
}

linePlot <- function(data, yvar="", xvar="time", title="Line Chart"){ 
   plot(gvisLineChart(data, xvar=xvar, yvar=yvar, options = list(title=title, height = 900)))
}

plot_invalidation <- function(){
   data <- numeric(20)
   data2 <- numeric(20)
   for (i in 1:20){
      heart_rate_datetime <- heart_rate %>% right_join(get_datetime_range(heart_rate), by = c("end" = "time")) %>% fill(bpm, duration, .direction = "down") %>% transmute(end, bpm = ifelse(duration > i, NA, bpm), duration)
      data[i] <- round(100*nrow(heart_rate %>% filter(duration > i))/nrow(heart_rate),2)
      data2[i] <- 100*round(count(is.na(heart_rate_datetime$bpm))/nrow(heart_rate_datetime),4)
   }
   plot(1:20, data, type = "b", xlab = "Invalidation", ylab = "Percent Data Points Lost")
   plot(1:20, data2, type = "b", xlab = "Invalidation", ylab = "Percent Time Lost")
}


# Parse and Clean Data 
date_format <- "%d-%b-%Y %H:%M"
 
heart_rate_raw <- read_csv("Heart Rate.csv")
heart_rate <- heart_rate_raw %>% transmute(bpm = `Heart Rate (count/min)`, end = parse_datetime(Finish, date_format), start = parse_datetime(Start, date_format))
heart_rate <- heart_rate %>% group_by(end) %>% mutate(bpm = mean(bpm)) %>% ungroup()
heart_rate <- get_duration_overlap(heart_rate)
heart_rate_datetime <- heart_rate %>% right_join(get_datetime_range(heart_rate), by = c("end" = "time")) %>% fill(bpm, duration, .direction = "down") %>% transmute(end, bpm = ifelse(duration > invalidate_at, NA, bpm), duration) %>% na.omit()
  
sleep_data_raw <- read_csv("Sleep Analysis.csv")
sleep_data <- sleep_data_raw %>% transmute(bed = `Minutes in bed`, sleep = `Minutes asleep`, start = parse_datetime(`In bed start`, date_format), end = parse_datetime(`In bed Finish`, date_format))
sleep_data <- get_duration_exclusive(sleep_data)
go_to_bed <- sleep_data %>% transmute(time = start, bed = TRUE)
out_of_bed <- sleep_data %>% transmute(time = end, bed = FALSE)
is_in_bed <- get_datetime_range(sleep_data)  %>% left_join(go_to_bed, by="time") %>% left_join(out_of_bed, by="time") %>% transmute(time, bed = coalesce(bed.x, bed.y)) %>% fill(bed, .direction = "down")
bed_heart_rate_datetime <- inner_join(heart_rate_datetime, is_in_bed, by=c("end" = "time")) %>% filter(bed == TRUE) %>% transmute(end, bpm)
 
active_calories_raw <- read_csv("Active Calories.csv")
active_calories <- active_calories_raw %>% transmute(cal = `Active Calories (kcal)`, end = parse_datetime(Finish, date_format), start = parse_datetime(Start, date_format))
active_calories <- get_duration_exclusive(active_calories)

resting_calories_raw <- read.csv("Resting Calories.csv")
resting_calories <- resting_calories_raw %>% transmute(cal = resting_calories_raw$Resting.Calories..kcal., end = parse_datetime(as.character(Finish), date_format), start = parse_datetime(as.character(Start), date_format))
resting_calories <- get_duration_exclusive(resting_calories)

cycling_distance_raw <- read_csv("Cycling Distance.csv")
cycling_distance <- cycling_distance_raw %>% transmute(miles = `Cycling Distance (mi)`, end = parse_datetime(Finish, date_format), start =  parse_datetime(Start, date_format))
cycling_distance <- get_duration_exclusive(cycling_distance)

distance_raw <- read_csv("Distance.csv")
distance <- distance_raw %>% transmute(miles = `Distance (mi)`, end = parse_datetime(Finish, date_format), start = parse_datetime(Start, date_format))
distance <- get_duration_exclusive(distance)

steps_raw <- read_csv("Steps.csv")
steps <- steps_raw %>% transmute(steps = `Steps (count)`, end = parse_datetime(Finish, date_format), start = parse_datetime(Start, date_format))
steps <- get_duration_exclusive(steps)

flights_climbed_raw <- read_csv("Flights Climbed.csv")
flights_climbed <- flights_climbed_raw %>% transmute(flights = `Flights Climbed (count)`, end = parse_datetime(Finish, date_format), start = parse_datetime(Start, date_format))
flights_climbed <- get_duration_exclusive(flights_climbed)

# Group By Date
heart_rate_date_mean <- heart_rate %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(bpm = weightedMean(bpm, weight)) 
heart_rate_date_median <- heart_rate %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(bpm = weightedMedian(bpm, weight)) 
heart_rate_date_max <- heart_rate %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(bpm = max(bpm)) 
heart_rate_date_min <- heart_rate %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(bpm = min(bpm)) 
 
sleep_data_date <- sleep_data %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(hours = round(sum(sleep)/60,2))
sleep_data_date <- sleep_data_date %>% filter(hours > 0)
bed_data_date <- sleep_data %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(hours = round(sum(bed)/60,2))
bed_heart_rate_date <- bed_heart_rate_datetime  %>%  mutate(date = as.Date(end + 21600)) %>% group_by(date) %>% summarise(bpm = mean(bpm, na.rm = TRUE))

active_calories_date <- active_calories %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(cal = sum(cal)) 
resting_calories_date <- resting_calories %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(cal = sum(cal))
cycling_distance_date <- cycling_distance %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(miles = sum(miles)) 
distance_date <- distance %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(miles = sum(miles)) 
steps_date <- steps %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(steps = sum(steps))
flights_climbed_date <- flights_climbed %>%  mutate(date = as.Date(end)) %>% group_by(date) %>% summarise(flights = sum(flights))

calendar <- heart_rate_date_mean %>% full_join(heart_rate_date_median, by="date") %>% full_join(heart_rate_date_max, by="date") %>% full_join(heart_rate_date_min, by="date") %>% full_join(sleep_data_date, by="date") %>% full_join(bed_data_date, by="date") %>% full_join(bed_heart_rate_date, by="date") %>% full_join(active_calories_date, by="date") %>% full_join(resting_calories_date, by="date") %>% full_join(cycling_distance_date, by="date") %>% full_join(distance_date, by="date") %>% full_join(steps_date, by="date") %>% full_join(flights_climbed_date, by="date") %>% arrange(date)
calendar <- calendar %>% transmute(date, mean_bpm = bpm.x, median_bpm = bpm.y, max_bpm = bpm.x.x, min_bpm = bpm.y.y, bed_bpm = bpm, bed = hours.y, sleep = hours.x, active_cal = cal.x, resting_cal = cal.y, cycling_miles = miles.x, miles = miles.y, steps, flights)
calendar <- calendar %>% mutate(bed=lead(bed), sleep=lead(sleep), bed_bpm=lead(bed_bpm))
#calendar <- calendar %>% mutate(rolling_bed = rollmean(bed, k = 5, fill = NA))
for (i in (1:8)*4){
   calendar[paste("rolling_bed_",i,sep = "")] <- rollmean(calendar$bed, k = i, fill = NA, align = "right")
}

# Group By Time
heart_rate_time <- heart_rate_datetime %>% transmute(time = format(end, "%I:%M %p"), bpm, minute = minute(end) + 60 * hour(end)) %>% group_by(time) %>%  summarise(bpm=mean(bpm, na.rm = TRUE), minute = mean(minute)) %>% arrange(minute) 

is_in_bed_time <- is_in_bed %>% transmute(bed, minute = minute(time) + 60 * hour(time), time = format(time, "%I:%M %p")) %>%  group_by(time) %>%  summarise(bed=mean(bed), minute = mean(minute)) %>% arrange(ifelse(minute >= 720, minute - 720, minute + 720) ) 

# active_calories_time <- active_calories %>% transmute(time = format(end, "%I:%M %p"), cal) %>% group_by(time) %>% summarise(cal = mean(cal))

# Group By Weekday 
weekdays <- c("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
heart_rate_weekday_mean <- heart_rate_date_mean %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(bpm = mean(bpm))
heart_rate_weekday_median <- heart_rate_date_median %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(bpm = mean(bpm))
heart_rate_weekday_max <- heart_rate_date_max %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(bpm = mean(bpm))
heart_rate_weekday_min <- heart_rate_date_min %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(bpm = mean(bpm))

sleep_data_weekday <- sleep_data_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(hours = mean(hours))
bed_data_weekday <- bed_data_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(hours = mean(hours)) 

active_calories_weekday <- active_calories_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(cal = mean(cal)) 
resting_calories_weekday <- resting_calories_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(cal = mean(cal))
cycling_distance_weekday <- cycling_distance_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(miles = mean(miles)) 
distance_weekday <- distance_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(miles = mean(miles)) 
steps_weekday <- steps_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(steps = mean(steps))
flights_climbed_weekday <- flights_climbed_date %>%  mutate(weekday = factor(weekdays(date), weekdays)) %>% group_by(weekday) %>% summarise(flights = mean(flights))
 
# Group By Weekday and Time
# heart_rate_time_weekday <- heart_rate_datetime %>% transmute(bpm, weekday = factor(weekdays(end), weekdays), minute = minute(end) + 60 * hour(end), time = format(end, "%I:%M %p")) %>%  group_by(weekday, time) %>%  summarise(bpm=mean(bpm), minute = mean(minute)) %>% arrange(minute) %>% pivot_wider(names_from = weekday, values_from = bpm)

is_in_bed_time_weekday <- is_in_bed %>% transmute(bed, weekday = factor(weekdays(time+21600), weekdays), minute = minute(time) + 60 * hour(time), time = format(time, "%I:%M %p")) %>%  group_by(weekday, time) %>%  summarise(bed=mean(bed), minute = mean(minute)) %>% arrange(ifelse(minute >= 720, minute - 720, minute + 720)) %>% pivot_wider(names_from = weekday, values_from = bed)
for(i in 3:9) is_in_bed_time_weekday[i] <- is_in_bed_time_weekday[i]/max(is_in_bed_time_weekday[i])

# --------- Visualize ------------

ggplot(data = inner_join(bed_heart_rate_date, bed_data_date), mapping = aes(x = bpm, y = hours)) + geom_point()
ggplot(data = inner_join(bed_heart_rate_date, active_calories_date), mapping = aes(x = bpm, y = cal)) + geom_point()
ggplot(data = inner_join(bed_heart_rate_date, cycling_distance_date), mapping = aes(x = bpm, y = miles)) + geom_point()

# Year Plots
yearPlot(heart_rate_date_mean, "HR Mean", max = 90)
yearPlot(heart_rate_date_median, "HR Median", max = 90)
yearPlot(heart_rate_date_max, "HR Max")
yearPlot(heart_rate_date_min, "HR Min")

yearPlot(sleep_data_date, "Sleep Hours", min = 4, max = 9)
yearPlot(bed_data_date, "Bed", min = 4, max = 9)
yearPlot(bed_heart_rate_date, "Bed Heart Rate", min = 40)

yearPlot(active_calories_date, "Active Calories", max = 2000)
yearPlot(resting_calories_date, "Resting Calories", min = 1500, max = 1800)
yearPlot(cycling_distance_date, "Cycling Distance")
yearPlot(distance_date, "Distance")
yearPlot(steps_date, "Steps")
yearPlot(flights_climbed_date, "Flights Climbed", max = 60)

# Time Line Graphs
linePlot(heart_rate_time, yvar="bpm", title = "Heart Rate")
#linePlot(heart_rate_time_weekday[-2], title = "Heart Rate By Time and Weekday")

linePlot(is_in_bed_time, yvar = "bed", title = "In Bed Time")
linePlot(is_in_bed_time_weekday[-2], title = "In Bed By Time and Weekday")

# linePlot(active_calories_time, title = "Active Calories by Time")

# Distriputions
ggplot(data = heart_rate, mapping = aes(x=bpm)) + geom_histogram(bins = 150) + ggtitle("Heart Rate Distribution")
ggplot(data = heart_rate_date_mean, mapping = aes(x=bpm)) + coord_cartesian(xlim=c(50,100)) + geom_histogram(bins = 150) + ggtitle("Mean Heart Rate Distribution")
ggplot(data = heart_rate_date_median, mapping = aes(x=bpm)) + geom_histogram(bins = 100) + ggtitle("Mediean Heart Rate Distribution")
ggplot(data = heart_rate_date_max, mapping = aes(x=bpm)) + geom_histogram(bins = 60) + ggtitle("Maximum Heart Rate Distribution")
ggplot(data = heart_rate_date_min, mapping = aes(x=bpm)) + geom_histogram(bins = 30) + ggtitle("Minimum Heart Rate Distribution")

ggplot(data = filter(sleep_data, sleep > 0), mapping = aes(x=sleep)) + geom_histogram(bins = 50) + ggtitle("Sleep Distribution")
ggplot(data = filter(sleep_data, sleep > 0), mapping = aes(x=bed)) + geom_histogram(bins = 50) + ggtitle("In Bed Distribution")
ggplot(data = bed_heart_rate_date, mapping = aes(x=bpm)) + geom_histogram(bins = 50) + ggtitle("Bed Heart Rate")

ggplot(data = active_calories_date, mapping = aes(x=cal)) + geom_histogram(bins = 150) + ggtitle("Active Calories Distribution")
ggplot(data = resting_calories_date, mapping = aes(x=cal)) + geom_histogram(bins = 150) + xlim(1500, 1900) + ggtitle("Resting Calories Distribution")
ggplot(data = cycling_distance_date, mapping = aes(x=miles)) + geom_histogram(bins = 20) + ggtitle("Cycling Distance Distribution")
ggplot(data = distance_date, mapping = aes(x=miles)) + geom_histogram(bins = 200) + ggtitle("Distance Distribution")
ggplot(data = steps_date, mapping = aes(x=steps)) + geom_histogram(bins = 200)  + ggtitle("Steps Distribution")
ggplot(data = flights_climbed_date, mapping = aes(x=flights)) + geom_histogram(bins = 50) + xlim(0, 100) + ggtitle("Flights Climbed Distribution")

# Weekday Bar Graphs 
ggplot(data = heart_rate_weekday_mean, mapping = aes(x= weekday, y=bpm)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(65,75)) + ggtitle("Mean Heart Rate Average Per Weekday")
ggplot(data = heart_rate_weekday_median, mapping = aes(x= weekday, y=bpm)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(60,70)) + ggtitle("Median Heart Rate Average Per Weekday")
ggplot(data = heart_rate_weekday_max, mapping = aes(x= weekday, y=bpm)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(135,160)) + ggtitle("Maximum Heart Rate Average Per Weekday")
ggplot(data = heart_rate_weekday_min, mapping = aes(x= weekday, y=bpm)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(43,46)) + ggtitle("Minimum Heart Rate Average Per Weekday")
 
ggplot(data = sleep_data_weekday, mapping = aes(x= weekday, y=hours)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(6,8)) + ggtitle("Sleep Average Per Weekday")
ggplot(data = bed_data_weekday, mapping = aes(x= weekday, y=hours)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(7,8)) + ggtitle("In Bed Average Per Weekday")

ggplot(data = active_calories_weekday, mapping = aes(x= weekday, y=cal)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(500,800)) + ggtitle("Active Calories Average Per Weekday")
ggplot(data = resting_calories_weekday, mapping = aes(x= weekday, y=cal)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(1650,1700)) + ggtitle("Resting Calories Average Per Weekday")
ggplot(data = cycling_distance_weekday, mapping = aes(x= weekday, y=miles)) + geom_bar(stat = "identity") + ggtitle("Heart Rate Distribution") + ggtitle("Cycling Distance Average Per Weekday")
ggplot(data = distance_weekday, mapping = aes(x= weekday, y=miles)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(2,4)) + ggtitle("Distance Average Per Weekday")
ggplot(data = steps_weekday, mapping = aes(x= weekday, y=steps)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(5000,8000)) + ggtitle("Steps Average Per Weekday")
ggplot(data = flights_climbed_weekday, mapping = aes(x= weekday, y=flights)) + geom_bar(stat = "identity") + coord_cartesian(ylim = c(20,35)) + ggtitle("Flights Climbed Average Per Weekday")


# Corellation
pairs(calendar[c(6, 2:5)]) # Heart 
pairs(calendar[c(6, 7:8, 15:22)]) # Sleep 
pairs(calendar[c(6, 9:14)]) # Activity 
 
n <- nrow(calendar)
n_train <- round(0.8 * n) 
set.seed(314159)
train_indices <- sample(1:n, n_train)
calendar_train <- calendar[train_indices,]  
calendar_test <- calendar[-train_indices,]

formula <- bed_bpm ~ max_bpm + bed + sleep + active_cal + miles + rolling_bed_24
lin_reg_model <- lm(data = calendar_train , formula) 
desc_tree_model <- rpart(formula, calendar_train)

calendar_test_lin_reg_results <- calendar_test %>% transmute(date, bed_bpm, prediction = predict.lm(lin_reg_model,newdata = calendar_test), error = bed_bpm-prediction) %>% na.omit()
calendar_test_desc_tree_results <- calendar_test %>% transmute(date, bed_bpm, prediction = predict(desc_tree_model,newdata = calendar_test), error = bed_bpm-prediction) %>% na.omit()

summary(calendar_test_lin_reg_results$error)
summary(calendar_test_desc_tree_results$error)
boxplot(calendar_test_lin_reg_results$error) 
boxplot(calendar_test_desc_tree_results$error)

ggplot(data=calendar_test_lin_reg_results, aes(bed_bpm, prediction)) + geom_point()
ggplot(data=calendar_test_desc_tree_results, aes(bed_bpm, prediction)) + geom_point(alpha = .2)

rpart.plot(model, type=4, clip.right.labs=FALSE, varlen=0, faclen=0)


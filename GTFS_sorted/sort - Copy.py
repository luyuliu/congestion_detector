import pandas as pd
import os
import numpy as np

os.chdir("D:\Luyu\COTA")
st = pd.read_csv("stop_times.csv")
trip = pd.read_csv("trip_sorted.csv")
print("readdone.")
a = pd.DataFrame()
start=0;
for j in range(len(trip)):
    start_flag=0
    for i in range(start,len(st)):
        if start_flag==1 and st.trip_id[i] != trip.trip_id[j]:
            start=i;
            break;
        if st.trip_id[i] == trip.trip_id[j]:
            start_flag=1 
            a.append(st[i:i + 1], ignore_index=True)
            a=a.append(st[i:i + 1], ignore_index=True)
    print(str(j/len(trip)*100)+"%")
    

a.to_csv('stop_times_sorted.csv')

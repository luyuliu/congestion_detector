import numpy as np
import pandas as pd
#timestamp=input("Enter a timestamp: ")

start=1512031920
end=1512073980
if __name__=='__main__':

    timestamp=start

    stop_info=pd.read_csv("D:\\Luyu\\congestion_detector\\GTFS_sorted\\stops_sorted_sim.csv")

    for b in range(int((end-start)/60-10)):
        try:
            table=np.loadtxt("D:\\Luyu\\data\\labelcsv\\label_"+str(timestamp)+".csv",delimiter=',',skiprows=1).transpose();
            stop_info['delay']=pd.Series(table,index=stop_info.index)
            stop_info.to_csv("D:\\Luyu\\data\\labelcsvvisual\\label_"+str(timestamp)+".csv",sep=',',index=False)
            print(timestamp)
            timestamp+=60
        except:
            timestamp+=60
    #continue;
    
  
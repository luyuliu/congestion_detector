import numpy as np
import arcpy
#timestamp=input("Enter a timestamp: ")

start=1512031980
end=1512073980



if __name__=='__main__':
    in_layer_or_view="D:\\Luyu\\GTFS\\STOPS.shp"
    in_field="FID"
    join_field="# id"
    layerName="STOPS"
    arcpy.MakeFeatureLayer_management (in_layer_or_view,  layerName)
    timestamp=start
    arcpy.env.workspace = "D:\\Luyu\\data"
    #for b in range(int((end-start)/60-10)):

    
    join_table="D:\\Luyu\\data\\delaycsvvisual\\delay_"+str(timestamp)+".csv"
    
    joind_table=arcpy.AddJoin_management (layerName, in_field, join_table, join_field)

    


    timestamp+=60
        
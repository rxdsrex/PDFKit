package com.pdfkit;

import android.os.Environment;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.jetbrains.annotations.NotNull;

public class FilesystemNativeModule extends ReactContextBaseJavaModule {
    FilesystemNativeModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "FilesystemNativeModule";
    }

    @ReactMethod
    public void getInternalStorageRoot(Promise promise) {
        try {
            String retData = Environment.getExternalStorageDirectory().getAbsolutePath();
            promise.resolve(retData);
        } catch (Exception e) {
            promise.reject("Error in getting Storage Directory path", e);
        }
    }
}

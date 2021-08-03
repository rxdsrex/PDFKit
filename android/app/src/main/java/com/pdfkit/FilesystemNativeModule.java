package com.pdfkit;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.UriPermission;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.FileUtils;
import android.os.ParcelFileDescriptor;
import android.provider.DocumentsContract;
import android.provider.OpenableColumns;

import androidx.annotation.NonNull;
import androidx.documentfile.provider.DocumentFile;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.List;

public class FilesystemNativeModule extends ReactContextBaseJavaModule {
    private static final int OPEN_TREE_REQUEST_CODE = 8733;
    private static final int OPEN_FILE_REQUEST_CODE = 3453;

    private static final String E_ACTIVITY_DOES_NOT_EXIST =
            "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
    private static final String E_FAILED_TO_SHOW_PICKER =
            "E_FAILED_TO_SHOW_PICKER";
    private static final String E_NO_FOLDER_DATA_FOUND = "E_NO_FOLDER_DATA_FOUND";
    private static final String E_NO_FILE_DATA_FOUND = "E_NO_FILE_DATA_FOUND";
    private static final String E_ROOT_FOLDER_NOT_ALLOWED =
            "E_ROOT_FOLDER_NOT_ALLOWED";

    private Promise safPickerPromise;

    FilesystemNativeModule(ReactApplicationContext context) {
        super(context);

        // This is the uri user has provided us
        // Here, we should do some checks on the uri, we do not want
        // root uri because it will not work on Android 11, or
        // perhaps we have some specific folder name that we want, etc
        // here we ask the content resolver to persist the permission for us
        // Resolve with Content Url of the selected folder
        ActivityEventListener mActivityEventListener =
                new BaseActivityEventListener() {
                    @Override
                    public void onActivityResult(Activity activity, int requestCode,
                                                 int resultCode, Intent intent) {
                        if (requestCode == OPEN_TREE_REQUEST_CODE) {
                            if (safPickerPromise != null) {
                                if (resultCode == Activity.RESULT_CANCELED) {
                                    safPickerPromise.resolve(E_PICKER_CANCELLED);
                                } else if (resultCode == Activity.RESULT_OK) {
                                    if (intent != null) {
                                        // This is the uri user has provided us
                                        Uri treeUri = intent.getData();
                                        if (treeUri != null) {
                                            // here we should do some checks on the uri, we do not
                                            // want root uri because it will not work on Android 11,
                                            // or perhaps we have some specific folder name that we
                                            // want, etc
                                            if (Build.VERSION.SDK_INT >= 30 &&
                                                    Uri.decode(treeUri.toString()).endsWith(":")) {
                                                safPickerPromise.resolve(E_ROOT_FOLDER_NOT_ALLOWED);
                                                return;
                                            }

                                            // here we ask the content resolver to persist the
                                            // permission for us
                                            int takeFlags = Intent.FLAG_GRANT_READ_URI_PERMISSION |
                                                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
                                            activity.getContentResolver()
                                                    .takePersistableUriPermission(treeUri, takeFlags);

                                            // Resolve with Content Url of the selected folder
                                            safPickerPromise.resolve(treeUri.toString());
                                        } else {
                                            safPickerPromise.resolve(E_NO_FOLDER_DATA_FOUND);
                                        }
                                    } else {
                                        safPickerPromise.reject("", "Intent is null");
                                    }
                                } else {
                                    safPickerPromise.reject("500", "Unhandled activity result");
                                }
                            }
                        } else if (requestCode == OPEN_FILE_REQUEST_CODE) {
                            if (safPickerPromise != null) {
                                if (resultCode == Activity.RESULT_CANCELED) {
                                    safPickerPromise.resolve(E_PICKER_CANCELLED);
                                } else if (resultCode == Activity.RESULT_OK) {
                                    if (intent != null) {
                                        // This is the uri of the file that user has selected
                                        Uri fileUri = intent.getData();
                                        if (fileUri != null) {
                                            // Resolve with Content Uri of the selected file
                                            safPickerPromise.resolve(fileUri.toString());
                                        }
                                    } else {
                                        safPickerPromise.resolve(E_NO_FILE_DATA_FOUND);
                                    }
                                } else {
                                    safPickerPromise.reject("500", "Unhandled activity result");
                                }
                            }
                        } else {
                            safPickerPromise.reject(
                                    "401", "This shouldn't happen, but it is happening");
                        }
                        safPickerPromise = null;
                    }
                };
        context.addActivityEventListener(mActivityEventListener);
    }

    @NonNull
    @NotNull
    @Override
    public String getName() {
        return "FilesystemNativeModule";
    }

    public boolean arePermissionsGranted(Activity currentActivity,
                                         String destinationRootFolderContentStr) {
        List<UriPermission> list =
                currentActivity.getContentResolver().getPersistedUriPermissions();
        for (int i = 0; i < list.size(); i++) {
            String persistedUriString = list.get(i).getUri().toString();
            if (persistedUriString.equals(destinationRootFolderContentStr) &&
                    list.get(i).isWritePermission() && list.get(i).isReadPermission()) {
                return true;
            }
        }
        return false;
    }

    public void releasePermissions(Activity currentActivity, Uri uri) {
        int flags = Intent.FLAG_GRANT_READ_URI_PERMISSION |
                Intent.FLAG_GRANT_WRITE_URI_PERMISSION;
        currentActivity.getContentResolver().releasePersistableUriPermission(uri,
                flags);
    }

    public DocumentFile createAppFolder(Activity currentActivity,
                                        String destinationRootFolderContentStr,
                                        String destinationFolderName)
            throws Exception {
        try {
            Uri rootFolderUri = Uri.parse(destinationRootFolderContentStr);
            DocumentFile dir =
                    DocumentFile.fromTreeUri(currentActivity, rootFolderUri);
            if (dir != null) {
                DocumentFile pdfKitFolder = dir.createDirectory(destinationFolderName);
                if (pdfKitFolder != null && pdfKitFolder.exists()) {
                    return pdfKitFolder;
                }
            }
            return null;
        } catch (Exception e) {
            throw new Exception(e.getMessage(), e.getCause());
        }
    }

    public String getFileName(Uri uri, Activity currentActivity) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            try (Cursor cursor = currentActivity.getContentResolver().query(
                    uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(
                            cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    @ReactMethod
    public void copyNResolveFilePath(String inputUriStr, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            String msg = "Activity doesn't exist";
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, msg, new Exception(msg));
            return;
        }

        Uri inputFileUri = Uri.parse(inputUriStr);

        FileInputStream input = null;
        FileOutputStream output = null;
        FileChannel inputChannel = null;
        FileChannel outputChannel = null;
        try {
            String cacheDirPath;
            File externalCacheDir = currentActivity.getExternalCacheDir();
            if (externalCacheDir != null && externalCacheDir.exists()) {
                cacheDirPath = externalCacheDir.getAbsolutePath();
            } else {
                File cacheDir = currentActivity.getCacheDir();
                if (cacheDir != null && cacheDir.exists()) {
                    cacheDirPath = currentActivity.getCacheDir().getAbsolutePath();
                } else {
                    promise.reject("500", "Cache directory not found");
                    return;
                }
            }

            String fileName = getFileName(inputFileUri, currentActivity);
            if (fileName == null || fileName.equals("")) {
                promise.reject("500", "Couldn't resolve file name from Uri");
                return;
            }

            String separator = cacheDirPath.endsWith("/") ? "" : "/";
            String filePath = cacheDirPath + separator + fileName;

            File fDelete = new File(filePath);
            if (fDelete.exists()) {
                boolean deleted = fDelete.delete();
                if (!deleted) {
                    String msg = "Temporary file could not be deleted";
                    promise.reject("500", msg);
                    return;
                }
            }

            DocumentFile inputDocFile = DocumentFile.fromSingleUri(
                    currentActivity.getApplicationContext(), inputFileUri);

            if (inputDocFile != null && inputDocFile.exists()) {
                FileDescriptor fd = currentActivity.getContentResolver()
                        .openFileDescriptor(inputFileUri, "r")
                        .getFileDescriptor();
                input = new FileInputStream(fd);
                output = new FileOutputStream(filePath);

                inputChannel = input.getChannel();
                outputChannel = output.getChannel();
                inputChannel.transferTo(0, inputChannel.size(), outputChannel);

                promise.resolve(filePath);
            } else {
                promise.reject("404", "Input file does not exists");
            }
        } catch (FileNotFoundException e) {
            String msg = "File not found: ";
            promise.reject("404", msg + e.getMessage(), e);
        } catch (IOException e) {
            promise.reject("500", "IO Exception: " + e.getMessage(), e);
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (IOException ignored) {
                }
            }
            if (output != null) {
                try {
                    output.flush();
                    output.close();
                } catch (IOException ignored) {
                }
            }
            if (inputChannel != null) {
                try {
                    inputChannel.close();
                } catch (IOException ignored) {
                }
            }
            if (outputChannel != null) {
                try {
                    outputChannel.close();
                } catch (IOException ignored) {
                }
            }
            input = null;
            output = null;
            inputChannel = null;
            outputChannel = null;
        }
    }

    @ReactMethod
    public void copyFileFromToPath(String sourceFolderPath, String sourceFileName,
                                   String destinationFolderUriStr, String mime,
                                   String destinationRootFolderTreeStr,
                                   Promise promise) {

        Uri destinationRootFolderUri;
        DocumentFile rootDir;
        Uri destinationFolderUri;
        DocumentFile appDir;
        DocumentFile outputFile = null;

        boolean gotError = false;
        Uri existingFileNewUri = null;

        FileInputStream sourceFileStream = null;
        FileOutputStream destinationFileStream = null;
        FileChannel inputChannel = null;
        FileChannel outputChannel = null;

        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            String msg = "Activity doesn't exist";
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, msg, new Exception(msg));
            return;
        }

        try {
            destinationRootFolderUri = Uri.parse(destinationRootFolderTreeStr);
            rootDir =
                    DocumentFile.fromTreeUri(currentActivity, destinationRootFolderUri);

            if (rootDir == null || !rootDir.exists()) {
                releasePermissions(currentActivity, destinationRootFolderUri);
                String msg =
                        "Root folder does not exists/deleted. Please request permission again";
                promise.reject("404", msg, new Exception(msg));
                return;
            } else {
                if (arePermissionsGranted(currentActivity,
                        destinationRootFolderTreeStr)) {
                    if (destinationFolderUriStr.equals("")) {
                        DocumentFile pdfKitFolder = rootDir.findFile("PdfKit");
                        if (pdfKitFolder != null) {
                            appDir = pdfKitFolder;
                        } else {
                            // Create output directory if it doesn't exist
                            appDir = createAppFolder(currentActivity,
                                    destinationRootFolderTreeStr, "PdfKit");
                        }
                        destinationFolderUriStr = appDir.getUri().toString();
                    } else {
                        destinationFolderUri = Uri.parse(destinationFolderUriStr);
                        appDir =
                                DocumentFile.fromTreeUri(currentActivity, destinationFolderUri);

                        if (appDir == null || !appDir.exists()) {
                            DocumentFile pdfKitFolder = rootDir.findFile("PdfKit");
                            if (pdfKitFolder != null) {
                                appDir = pdfKitFolder;
                            } else {
                                // Create output directory if it doesn't exist
                                appDir = createAppFolder(
                                        currentActivity, destinationRootFolderTreeStr, "PdfKit");
                            }
                            destinationFolderUriStr = appDir.getUri().toString();
                        }
                    }
                } else {
                    String msg =
                            "Read/Write access to the folder not present. Please request again.";
                    promise.reject("401", msg);
                    return;
                }
            }

            if (!appDir.exists()) {
                String msg = "App folder could not be created";
                promise.reject("500", msg, new Exception(msg));
                return;
            }

            DocumentFile existingFile = appDir.findFile(sourceFileName);
            if (existingFile != null && existingFile.isFile()) {
                String name =
                        sourceFileName.substring(0, sourceFileName.lastIndexOf("."));
                String suffix =
                        sourceFileName.substring(sourceFileName.lastIndexOf("."));
                String newName = name + "_replace" + suffix;
                existingFileNewUri = DocumentsContract.renameDocument(
                        currentActivity.getContentResolver(), existingFile.getUri(),
                        newName);
            }

            outputFile = appDir.createFile(mime, sourceFileName);
            if (outputFile != null && outputFile.canWrite()) {
                // Create file streams
                String separator = sourceFolderPath.endsWith("/") ? "" : "/";
                sourceFileStream =
                        new FileInputStream(sourceFolderPath + separator + sourceFileName);
                ParcelFileDescriptor pfd =
                        currentActivity.getContentResolver().openFileDescriptor(
                                outputFile.getUri(), "w");
                destinationFileStream = new FileOutputStream(pfd.getFileDescriptor());

                // For API level 29
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    FileUtils.copy(sourceFileStream, destinationFileStream);
                } else {
                    // Copy the bytes from sourceFileStream to destinationFileStream
                    inputChannel = sourceFileStream.getChannel();
                    outputChannel = destinationFileStream.getChannel();
                    inputChannel.transferTo(0, inputChannel.size(), outputChannel);
                }

                if (existingFileNewUri != null) {
                    DocumentsContract.deleteDocument(currentActivity.getContentResolver(),
                            existingFileNewUri);
                }

                WritableMap response = new WritableNativeMap();
                response.putString("destinationFolderUriStr", destinationFolderUriStr);
                response.putString("outputFileUriStr", outputFile.getUri().toString());
                promise.resolve(response);
            } else {
                String msg = "Output file could not be created";
                promise.reject("500", msg, new Exception(msg));
            }
        } catch (FileNotFoundException e) {
            gotError = true;
            promise.reject("500", "File not found: " + e.getMessage(), e);
        } catch (IOException e) {
            gotError = true;
            promise.reject("500", "IO Exception: " + e.getMessage(), e);
        } catch (Exception e) {
            gotError = true;
            promise.reject("500", "Exception: " + e.getMessage(), e);
        } finally {
            if (sourceFileStream != null) {
                try {
                    sourceFileStream.close();
                } catch (IOException ignored) {
                }
            }
            if (destinationFileStream != null) {
                try {
                    destinationFileStream.flush();
                    destinationFileStream.close();
                } catch (IOException ignored) {
                }
            }
            if (inputChannel != null) {
                try {
                    inputChannel.close();
                } catch (IOException ignored) {
                }
            }
            if (outputChannel != null) {
                try {
                    outputChannel.close();
                } catch (IOException ignored) {
                }
            }
            sourceFileStream = null;
            destinationFileStream = null;
            inputChannel = null;
            outputChannel = null;

            boolean deleted = true;

            if (gotError && outputFile != null && outputFile.exists()) {
                try {
                    deleted = DocumentsContract.deleteDocument(
                            currentActivity.getContentResolver(), outputFile.getUri());
                } catch (FileNotFoundException ignored) {
                }
            }

            if (gotError && deleted && existingFileNewUri != null) {
                try {
                    DocumentsContract.renameDocument(currentActivity.getContentResolver(),
                            existingFileNewUri, sourceFileName);
                } catch (FileNotFoundException ignored) {
                }
            }
        }
    }

    @ReactMethod
    public void deleteFileByPath(String inputPath, String inputFileName,
                                 Promise promise) {
        try {
            String path;
            if (inputFileName.equals("")) {
                path = inputPath;
            } else {
                String separator = inputPath.endsWith("/") ? "" : "/";
                path = inputPath + separator + inputFileName;
            }
            File inputFile = new File(path);
            if (inputFile.exists()) {
                // delete the file
                boolean done = inputFile.delete();
                promise.resolve(done);
                return;
            }
            promise.resolve(false);
        } catch (Exception e) {
            promise.reject("500", "Exception: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void getDocumentsDirectoryContentUri(Promise promise) {
        String extRootPath =
                Environment.getExternalStorageDirectory().getAbsolutePath();
        String separator = extRootPath.endsWith("/") ? "" : "/";
        String fullPath = extRootPath + separator + Environment.DIRECTORY_DOCUMENTS;
        File docFolder = new File(fullPath);
        if (docFolder.exists())
            promise.resolve(Uri.fromFile(docFolder).getPath());
        else
            promise.resolve("");
    }

    @ReactMethod
    public void getCacheDirectoryPath(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                String msg = "Activity doesn't exist";
                promise.reject(E_ACTIVITY_DOES_NOT_EXIST, msg, new Exception(msg));
                return;
            }

            String cacheDirPath;
            File externalCacheDir = currentActivity.getExternalCacheDir();
            if (externalCacheDir != null && externalCacheDir.exists()) {
                cacheDirPath = externalCacheDir.getAbsolutePath();
            } else {
                File cacheDir = currentActivity.getCacheDir();
                if (cacheDir != null && cacheDir.exists()) {
                    cacheDirPath = cacheDir.getAbsolutePath();
                } else {
                    promise.reject("404", "Cache directory not found");
                    return;
                }
            }
            promise.resolve(cacheDirPath);
        } catch (Exception e) {
            promise.reject("500", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void askPermissionForStorage(String docUriStr, final Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();

            if (currentActivity == null) {
                promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
                return;
            }
            safPickerPromise = promise;

            // Choose a directory using the system's file picker.
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);

            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION |
                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION |
                    Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION |
                    Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);

            if (!docUriStr.equals("")) {
                Uri docFolderUri = Uri.parse(docUriStr);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                        docFolderUri != null)
                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, docFolderUri);
            }

            currentActivity.startActivityForResult(intent, OPEN_TREE_REQUEST_CODE);
        } catch (Exception e) {
            safPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e.getMessage(), e);
            safPickerPromise = null;
        }
    }

    @ReactMethod
    public void openDocumentInChosenApp(String documentUriStr, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
            return;
        }

        Uri documentUri = Uri.parse(documentUriStr);
        Intent docIntent = new Intent(Intent.ACTION_VIEW);
        docIntent.setDataAndType(documentUri, "application/pdf");
        docIntent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        try {
            currentActivity.startActivity(docIntent);
            promise.resolve(true);
        } catch (ActivityNotFoundException e) {
            promise.reject("500", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void openPdfFileForRead(String appFolderUriStr, Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();

            if (currentActivity == null) {
                promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
                return;
            }
            safPickerPromise = promise;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            if (!appFolderUriStr.equals("")) {
                Uri appFolderUri = Uri.parse(appFolderUriStr);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                        appFolderUri != null)
                    intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, appFolderUri);
            }

            currentActivity.startActivityForResult(intent, OPEN_FILE_REQUEST_CODE);
        } catch (Exception e) {
            safPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e.getMessage(), e);
            safPickerPromise = null;
        }
    }

    @ReactMethod
    public void checkTreePermissionsGranted(String treeUriStr, Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                String msg = "Activity doesn't exist";
                promise.reject(E_ACTIVITY_DOES_NOT_EXIST, msg, new Exception(msg));
                return;
            }

            boolean granted = arePermissionsGranted(currentActivity, treeUriStr);
            promise.resolve(granted);
        } catch (Exception e) {
            promise.reject("500", e.getMessage(), e);
        }
    }
}

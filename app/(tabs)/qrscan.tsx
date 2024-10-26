import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  cancelAnimation,
  useSharedValue,
} from 'react-native-reanimated';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const SCAN_AREA_SIZE = WINDOW_WIDTH * 0.7;

interface BarCodeEvent {
  type: string;
  data: string;
}

const QRScan = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scanLinePosition = useSharedValue(0);

  // Request camera permissions
  React.useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // Animate scan line
  React.useEffect(() => {
    scanLinePosition.value = withRepeat(
      withSequence(
        withTiming(-SCAN_AREA_SIZE / 2, { duration: 1500 }),
        withTiming(SCAN_AREA_SIZE / 2, { duration: 1500 })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(scanLinePosition);
    };
  }, []);

  const animatedScanLine = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  const handleBarCodeScanned = useCallback((event: BarCodeEvent) => {
    if (!scanned) {
      setScanned(true);
      setScannedData(event.data);
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [scanned]);

  const handleRescan = useCallback(() => {
    setScanned(false);
    setScannedData(null);
    bottomSheetRef.current?.snapToIndex(-1);
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              {/* Top mask */}
              <View style={[styles.maskSection, { height: (WINDOW_HEIGHT - SCAN_AREA_SIZE) / 2 }]} />
              
              {/* Middle section with scan area */}
              <View style={styles.middleSection}>
                <View style={styles.maskSection} />
                <View style={styles.scanArea}>
                  {/* Corner markers */}
                  <View style={[styles.cornerMarker, styles.topLeft]} />
                  <View style={[styles.cornerMarker, styles.topRight]} />
                  <View style={[styles.cornerMarker, styles.bottomLeft]} />
                  <View style={[styles.cornerMarker, styles.bottomRight]} />
                  
                  {/* Animated scan line */}
                  <Animated.View style={[styles.scanLine, animatedScanLine]} />
                  
                  {/* Instruction text */}
                  <Text style={styles.instructionText}>
                    Position QR code within frame
                  </Text>
                </View>
                <View style={styles.maskSection} />
              </View>
              
              {/* Bottom mask */}
              <View style={[styles.maskSection, { height: (WINDOW_HEIGHT - SCAN_AREA_SIZE) / 2 }]} />
            </View>
          </CameraView>
        </SafeAreaView>

        {/* Absolutely positioned bottom sheet */}
        <View style={styles.bottomSheetContainer}>
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['50%']}
            index={-1}
            enablePanDownToClose
            handleIndicatorStyle={styles.bottomSheetIndicator}
            backgroundStyle={styles.bottomSheetBackground}
            style={styles.bottomSheet}
          >
            <BottomSheetView style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>Scanned QR Code</Text>
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Content:</Text>
                <Text style={styles.dataValue}>{scannedData}</Text>
              </View>
              <TouchableOpacity 
                style={styles.rescanButton} 
                onPress={handleRescan}
              >
                <Ionicons name="scan" size={24} color="white" style={styles.rescanIcon} />
                <Text style={styles.rescanText}>Scan Again</Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  maskSection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  middleSection: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#00ff00',
    opacity: 0.7,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: 100,
  },
  bottomSheet: {
    marginHorizontal: 0,
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomSheetIndicator: {
    backgroundColor: '#E5E7EB',
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  dataContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
  },
  rescanIcon: {
    marginRight: 8,
  },
  rescanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QRScan;
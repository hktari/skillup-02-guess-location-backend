import {
  distanceInKmBetweenEarthCoordinates,
  distanceInMetersBetweenEarthCoordinates,
} from './utility';

describe('utility.ts', () => {
  describe('distanceInKmBetweenEarthCoordinates', () => {
    it('should return result in km', () => {
      const result = 5918.185064088764;
      expect(distanceInKmBetweenEarthCoordinates(51.5, 0, 38.8, -77.1)).toEqual(
        result,
      );
    });
  });

  describe('distnaceInMetersBetweenEarthCoordinates', () => {
    class GPS {
      constructor(public lat: number, public lng: number) {}
    }
    const testCases: [srcGPS: GPS, destGPS: GPS, resultInMeters: number][] = [
      [
        new GPS(46.0503, 14.5046),
        new GPS(46.05454485536285, 14.498534189175349),
        664,
      ],
      [
        new GPS(46.0486055418881, 14.565875977562222),
        new GPS(46.554676264667144, 15.64668326325048),
        100299,
      ],
    ];

    testCases.forEach((testCase, idx) => {
      const [srcGPS, destGPS, resultInMeters] = testCase;

      it(`[${idx}]: should return ${resultInMeters} meters as integer`, () => {
        expect(
          distanceInMetersBetweenEarthCoordinates(
            srcGPS.lat,
            srcGPS.lng,
            destGPS.lat,
            destGPS.lng,
          ),
        ).toEqual(resultInMeters);
      });
    });
  });
});

const AttendanceData = require("../models/attendance.model");

exports.createAttendance = async (req, res) => {
  const {
    UserID,
    Nama,
    Tanggal,
    Bulan,
    Tahun,
    ScoreSkrining,
    HasilSkrining,
    Keterangan,
  } = req.body;
  try {
    const Attendance = await AttendanceData.find({ Tanggal, Bulan, Tahun });
    if (Attendance.length < 15) {
      const Attendance2 = await AttendanceData.findOne({
        UserID,
        Nama,
        Tanggal,
        Bulan,
        Tahun,
      });
      if (!Attendance2) {
        const data = new AttendanceData({
          UserID,
          Nama,
          Tanggal,
          Bulan,
          Tahun,
          ScoreSkrining,
          HasilSkrining,
          Keterangan,
        });
        await data.save().then(() => {
          res.status(200).json({
            data,
            message: `Pengajuan kunjungan untuk ${Tanggal} ${Bulan} ${Tahun} diterima`,
          });
        });
      } else {
        res.status(200).json({
          message: `Anda sudah mengajukan kunjungan pada ${Tanggal} ${Bulan} ${Tahun}`,
        });
      }
    } else {
      res.status(200).json({
        message: `Kuota kunjungan pada ${Tanggal} ${Bulan} ${Tahun} sudah penuh`,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error");
  }
};

exports.CheckIn = async (req, res) => {
  const { UserID, Tanggal, Bulan, Tahun, CheckIn } = req.body;
  try {
    const filter = { UserID, Tanggal, Bulan, Tahun };
    const update = { CheckIn };
    const check = await AttendanceData.findOne(filter);
    console.log(check);
    if (check.Status) {
      if(!check.CheckIn) {
        await AttendanceData.updateOne(filter, update).then(() => {
          res.status(200).json({
            message: `Selamat datang ${check.Nama}, check in berhasil pada ${update.CheckIn}`,
          });
        });
      } else {
        res.status(200).json({
          message: `Anda sudah check in pada ${update.CheckIn}`,
        });
      }
    } else {
      res.status(200).json({
        message: "Silahkan upload bukti test Covid-19 terlebih dahulu",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error");
  }
};

exports.CheckOut = async (req, res) => {
  const { UserID, Tanggal, Bulan, Tahun, CheckOut } = req.body;
  try {
    const filter = { UserID, Tanggal, Bulan, Tahun };
    const update = { CheckOut };
    const check = await AttendanceData.findOne(filter);
    if (check.CheckIn !== null && check.CheckOut === null) {
      await AttendanceData.updateOne(filter, update).then(() => {
        res.status(200).json({
          message: `Terimakasih atas kunjungannya, check out berhasil pada ${update.CheckOut}`,
        });
      });
    } else if (check.CheckIn === null) {
      res.status(403).json({
        message: "Anda belum check in, silahkan check in dulu",
      });
    } else {
      res.status(200).json({
        message: `Anda sudah check out pada ${update.CheckOut}`,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error");
  }
};

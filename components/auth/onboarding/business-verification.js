import React, { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { CheckCircle, AlertCircle, Upload, FileText, Shield, Building2, User, X, File, Download } from "lucide-react";

export default function BusinessVerification() {
	const { control, watch, setValue } = useFormContext();
	const [dragActive, setDragActive] = useState({});
	const fileInputRefs = useRef({});

	// Watch form values for validation feedback
	const ein = watch("businessVerification.ein");
	const registrationDocument = watch("businessVerification.registrationDocument");
	const businessLicense = watch("businessVerification.businessLicense");
	const proofOfOwnership = watch("businessVerification.proofOfOwnership");
	const ownerID = watch("businessVerification.ownerID");

	const handleDrag = (e, fieldName) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive((prev) => ({ ...prev, [fieldName]: true }));
		} else if (e.type === "dragleave") {
			setDragActive((prev) => ({ ...prev, [fieldName]: false }));
		}
	};

	const handleDrop = (e, fieldName) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive((prev) => ({ ...prev, [fieldName]: false }));

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileSelect(Array.from(e.dataTransfer.files), fieldName);
		}
	};

	const handleFileSelect = (files, fieldName) => {
		setValue(`businessVerification.${fieldName}`, files);
	};

	const removeFile = (fieldName) => {
		setValue(`businessVerification.${fieldName}`, []);
	};

	const formatFileSize = (bytes) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const FileUploadField = ({ fieldName, label, description, icon: Icon, required = true }) => {
		const files = watch(`businessVerification.${fieldName}`);
		const hasFiles = files && files.length > 0;

		return (
			<FormField
				control={control}
				name={`businessVerification.${fieldName}`}
				render={({ field, fieldState }) => (
					<FormItem>
						<FormLabel className="flex items-center gap-2">
							<Icon className="w-4 h-4" />
							{label} {required && <span className="text-red-500">*</span>}
						</FormLabel>
						<FormDescription>{description}</FormDescription>

						{!hasFiles ? (
							<Card className={`border-2 border-dashed transition-colors ${dragActive[fieldName] ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`} onDragEnter={(e) => handleDrag(e, fieldName)} onDragLeave={(e) => handleDrag(e, fieldName)} onDragOver={(e) => handleDrag(e, fieldName)} onDrop={(e) => handleDrop(e, fieldName)}>
								<CardContent className="p-6">
									<div className="text-center space-y-3">
										<Upload className="w-8 h-8 mx-auto text-muted-foreground" />
										<div>
											<p className="text-sm font-medium">
												Drag and drop files here, or{" "}
												<Button variant="link" className="p-0 h-auto text-primary" onClick={() => fileInputRefs.current[fieldName]?.click()}>
													browse
												</Button>
											</p>
											<p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
										</div>
									</div>
								</CardContent>
							</Card>
						) : (
							<div className="space-y-2">
								{files.map((file, index) => (
									<div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
										<div className="flex items-center gap-3">
											<File className="w-5 h-5 text-muted-foreground" />
											<div>
												<p className="text-sm font-medium">{file.name}</p>
												<p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
											</div>
										</div>
										<Button variant="ghost" size="sm" onClick={() => removeFile(fieldName)} className="text-muted-foreground hover:text-destructive">
											<X className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						<input ref={(el) => (fileInputRefs.current[fieldName] = el)} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileSelect(Array.from(e.target.files), fieldName)} />

						<FormMessage>{fieldState.error?.message}</FormMessage>
					</FormItem>
				)}
			/>
		);
	};

	return (
		<>
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold leading-9 text-left">Business Verification</h2>
					<p className="text-sm leading-6 text-left text-muted-foreground">Complete the form below to provide verification documents for your business.</p>
				</div>

				{/* Security Notice */}
				<Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
					<Shield className="h-4 w-4 text-blue-600" />
					<AlertDescription>
						<strong>Security Notice:</strong> All documents are encrypted and securely stored. We only use these documents to verify your business ownership and will never share them with third parties.
					</AlertDescription>
				</Alert>

				<div className="flex flex-col space-y-6">
					<FormField
						control={control}
						name="businessVerification.ein"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2">
									<Building2 className="w-4 h-4" />
									EIN <span className="text-red-500">*</span>
								</FormLabel>
								<FormDescription>Your Employer Identification Number in format XX-XXXXXXX</FormDescription>
								<FormControl>
									<Input
										{...field}
										placeholder="XX-XXXXXXX"
										maxLength={10}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, "");
											if (value.length <= 9) {
												const formatted = value.replace(/^(\d{2})(\d{7})$/, "$1-$2");
												field.onChange(formatted);
											}
										}}
									/>
								</FormControl>
								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>

					<FileUploadField fieldName="registrationDocument" label="Business Registration Document" description="Proof that your business is registered with the state (Articles of Incorporation, DBA, etc.)" icon={FileText} />

					<FileUploadField fieldName="businessLicense" label="Business License" description="Current business license or permit from your local jurisdiction" icon={Building2} />

					<FileUploadField fieldName="proofOfOwnership" label="Proof of Company Ownership" description="Document showing you own or have authority to represent this business" icon={Shield} />

					<FileUploadField fieldName="ownerID" label="Owner's Government-Issued ID" description="Driver's license, passport, or other government-issued photo ID" icon={User} />

					{/* Helpful Tips */}
					<Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
						<CardContent className="p-4">
							<div className="space-y-2">
								<h3 className="text-sm font-medium flex items-center gap-2">
									<AlertCircle className="w-4 h-4 text-amber-600" />
									Document Requirements
								</h3>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• All documents must be current and valid</li>
									<li>• PDF files are preferred for better quality</li>
									<li>• Ensure all text is clearly readable</li>
									<li>• File size limit: 10MB per document</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
